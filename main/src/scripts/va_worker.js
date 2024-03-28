const refresher = require('./refresher.js')

const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;
const moment = require('moment-timezone');
const offerChecker = require('./auto_offerer.js')
const writer = require('./write_activity_mongo.js')
const availabilityParser = require('./closet_parser.js')
const chalk = require('chalk');

const logHeaders = {
  mongo: chalk.blue.bold("[MONGO] "),
  info: chalk.green.bold("[INFO] "),
  err: chalk.red.bold("[ERR] "),
  socket: chalk.magenta.bold("[SOCK] ")
}

class UserOptions {
  constructor(authuser, removeUserFromUserHash) {
    this.removeUserFromUserHash = removeUserFromUserHash
    this.authuser = authuser
    this.isUpdating = false
    this.counter = 0
    this.timezone = ""
    this.username = ""
    this.cookies = {}
    this.offerSettings = null
    this.schedule = []
    this.scheduledOptions = {}
    this.scheduledClock = null
    this.continuousClock = null
    this.offerClock = null
    this.offerClockStartTime = null
    this.autoFollowerEnable = false;
    this.refresherEnable = false;
    this.socket = null
    this.activity = []
    this.initialize()
  }

  async initialize() {
    await this.getUserInfo()
    await this.getSettingsFromMongo(true)
    await this.getOfferSettingsFromMongo()
    await this.updateActivityBoard(true)

    if (!this.continuousClock) {
      await this.getContinuousSettingsFromMongo(true)
    }
  }


  async getUserInfo() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()
    console.log(logHeaders.mongo + chalk.blue('LOADING INFO FOR ' + this.authuser))
    try {
      const newcollection = client.db('user_settings').collection(this.authuser);
      const newresult = await newcollection.find().toArray();

      this.username = newresult[0].userInfo.username
      this.cookies = newresult[0].userInfo.cookies




    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in getUserInfo: " + err, "user_errors")
      console.error(err);
      return err
    } finally {
      await client.close();

    }
  }

  refreshConnection() {

    this.updateActivityBoard(true)

  }



  addSocket(socket) {
    if (this.socket) {
      this.socket.disconnect()
    }

    this.socket = socket

    socket.on('disconnect', () => {

      console.log(logHeaders.socket + chalk.magenta("Disconnecting socket for: " + this.authuser))

    })

    this.socket.on("updateSettings", (msg) => {
      this.getSettingsFromMongo()
    })


    this.socket.on('updateContinousSettings', (msg) => {
      this.getContinuousSettingsFromMongo()
    })

    this.socket.on("updateOfferSettings", (msg) => {
      this.getOfferSettingsFromMongo()
    })

  }

  combineDictionaryValues(dict1, dict2) {
    var combinedValues = [];

    for (var key in dict1) {
      if (dict1.hasOwnProperty(key) && dict1[key].hasOwnProperty('value')) {

        combinedValues.push(dict1[key].value);


      }
    }

    for (var key in dict2) {
      if (dict2.hasOwnProperty(key) && dict2[key].hasOwnProperty('value')) {

        combinedValues.push(dict2[key].value);

      }
    }

    return combinedValues;
  }


  async getActivityFromMongo() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()

    try {
      const database = client.db('user_activity')

      const collectionExists = await database.listCollections({ name: this.authuser }).hasNext();

      if (!collectionExists) {
        // Create the collection
        await database.createCollection(this.authuser);


      } else {

        const projection = { _id: 0 };

        const activity = await database.collection(this.authuser).find({}).project(projection).toArray();
        // console.log(activity)


        if (!(await database.collection(this.authuser).countDocuments() === 0)) {


          this.activity = activity

        }

      }


    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in getActivityFromMongo: " + err, "user_errors")
      console.error(err);
      return err
    } finally {
      await client.close();

    }



  }

  async getSettingsFromMongo(firstRun) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()

    try {
      const newcollection = client.db('user_settings').collection(this.authuser);
      const jsonData = await newcollection.find().toArray();

      let timeArr = this.combineDictionaryValues(jsonData[0].scheduleSettings.firstEntries, jsonData[0].scheduleSettings.secondEntries)
      this.updateSettings(timeArr)

      let isEnabled = jsonData[0].scheduleSettings.enabled
      this.scheduledOptions['sharingOrder'] = jsonData[0].scheduleSettings.sharingOrder
      this.scheduledOptions['sharingSpeed'] = jsonData[0].scheduleSettings.sharingSpeed

      if (isEnabled && (!firstRun || this.scheduledClock === null)) {
        console.log('enabled, trying to see if ' + this.scheduledClock);
        this.startClock();
        await writer.writeActivityToMongo(this.authuser, "STARTING REFRESHER", "user_activity");
      } else if (!isEnabled && !firstRun) {
        this.stopClock("PAUSING REFRESHER");
        await writer.writeActivityToMongo(this.authuser, "STOPPING REFRESHER", "user_activity");
      }
      
      if (!firstRun) {
        await this.updateActivityBoard();
      }

    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in getSettingsFromMongo: " + err, "user_errors")
      console.error(err);
      return err
    } finally {
      await client.close();

    }
  }

  async getContinuousSettingsFromMongo(firstRun) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()

    try {
      const newcollection = client.db('user_settings').collection(this.authuser);
      const jsonData = await newcollection.find().toArray();

      let isEnabled = jsonData[0].continuousSettings.enabled

      if (isEnabled && (!firstRun || this.continuousClock === null)) {
        console.log('enabled, trying to see if ' + this.continuousClock);
        this.startClock();
        await writer.writeActivityToMongo(this.authuser, "STARTING REFRESHER", "user_activity");
      } else if (!isEnabled && !firstRun) {
        this.stopClock("PAUSING REFRESHER");
        await writer.writeActivityToMongo(this.authuser, "STOPPING REFRESHER", "user_activity");
      }
      
      if (!firstRun) {
        await this.updateActivityBoard();
      }
      



    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in getContinuousSettingsFromMongo: " + err, "user_errors")
      console.error(err);
      return err
    } finally {
      await client.close();

    }
  }

  async getOfferSettingsFromMongo() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()

    try {
      const newcollection = client.db('user_settings').collection(this.authuser);
      const jsonData = await newcollection.find().toArray();

      this.updateOfferSettings(jsonData[0].offerSettings)

      let isOfferEnabled = jsonData[0].offerSettings.enabled

      if (isOfferEnabled) {
        if (!this.offerClock) {
          this.startOfferClock()
          await writer.writeActivityToMongo(this.authuser, "STARTING AUTO OFFER", "user_activity")
        }
      }
      else {
        if (this.offerClock) {
          this.stopOfferClock("PAUSING OFFER")
          await writer.writeActivityToMongo(this.authuser, "STOPPING AUTO OFFER", "user_activity")
        }
      }

      await this.updateActivityBoard()

    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in getOfferSettingsFromMongo: " + err, "user_errors")
      console.error(err);
      return err
    } finally {
      await client.close();

    }
  }

  async writeActivityToMongo(msgString) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()

    try {
      const collection = client.db("user_activity").collection(this.authuser);

      const currentTimeUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss');

      const msgData = { [currentTimeUTC]: msgString }
      const result = await collection.insertOne(msgData);
      console.log(logHeaders.mongo + chalk.blue(`${msgString} was inserted for ${this.authuser}`));



    } catch (err) {
      writer.writeActivityToMongo(this.authuser, "Error in writeActivityToMongo: " + err, "user_errors")
      console.error(err);
    } finally {
      await client.close();
    }
  }


  async updateActivityBoard() {

    await this.getActivityFromMongo()

    try {
      if (this.socket) {
        this.socket.emit('updateActivityBoard', this.activity)
      }
    }
    catch (err)
    {
      writer.writeActivityToMongo(this.authuser, "Error in updateActivityBoard: " + err, "user_errors")
      console.log(logHeaders.err + chalk.red('User', this.authuser, 'disconnected from socket too fast, removing.'))
      this.removeUserFromUserHash(this.authuser)
    }
  }

  updateSettings(timelist) {

    this.schedule = (timelist)
    console.log(logHeaders.info + chalk.green(this.username, "has timelist", JSON.stringify(timelist)))
    //call mongo script to read new settings
    //pass username
  }

  updateOfferSettings(offerSettings) {
    this.offerSettings = offerSettings
  }


  updateCounter(item) {
    this.counter += 1
    console.log(logHeaders.info + chalk.green(`Updating #${this.counter}:`, item))
  }

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  async doRefresh() {
    writer.writeActivityToMongo(this.authuser, "Attempting refreshing...", "user_activity")
    this.updateActivityBoard(Date.now())
    this.max = 9000
    
    if ((this.currCounter < this.max) || !this.currCounter) {
      try {
        let res = await availabilityParser.getPoshmarkDict(this.username, "available")
        let items;
        if (this.scheduledOptions.sharingOrder == 0) {
          items = res
        }
        else if (this.scheduledOptions.sharingOrder == 1) {
          items = res.reverse()
        }
        else {
          console.log('randomizing')
          items = this._shuffleArray(res)
        }
        let avgDelay = this.sharingSpeed == 0 ? 4 : this.sharingSpeed == 1 ? 6 : this.sharingSpeed == 2 ? 8.5 : 5

        console.log(logHeaders.info + chalk.green('The estimated refresh time is:', Math.round((avgDelay * res.length) / 60), 'mins'))
        this.isUpdating = true
        await refresher.refreshAllUserItems(items, this.cookies.jwt, this.cookies.ui, this.scheduledOptions.sharingSpeed, this.updateCounter.bind(this), writer.writeActivityToMongo.bind(this))
        this.isUpdating = false
      } catch (error) {
        writer.writeActivityToMongo(this.authuser, "Error in doRefresh: " + error, "user_errors")
        console.dir(error)
        this.isUpdating = false
      }
    }
    else {
      writer.writeActivityToMongo(this.authuser, "6000 items have been refreshed.", "user_activity")
      this.updateActivityBoard(Date.now())
      return false
    }
    writer.writeActivityToMongo(this.authuser, "Done refreshing items", "user_activity")
    this.updateActivityBoard(Date.now())
    return false
  }


  startClock() {

    //setInterval starting with next minute
    const now = Date.now();
    this.currCounter = 0

    // Calculate the number of milliseconds until the next minute begins
    const timeUntilNextMinute = (60 - new Date(now).getSeconds()) * 1000;


    if (!(this.scheduledClock === null)) {
      clearInterval(this.scheduledClock)
    }



    // Wait until the next minute begins
    console.log(logHeaders.info + chalk.green("Waiting " + timeUntilNextMinute + " for user: " + this.username))
    setTimeout(() => {
      console.log(logHeaders.info + chalk.green("Checking time for user: " + this.username))
      this.checkForTimeMatch()

      // Start the setInterval function to execute the specified function every minute
      this.scheduledClock = setInterval(() => {
        try {
          console.log(logHeaders.info + chalk.green("Checking time for user: " + this.username))
          this.checkForTimeMatch()

        } catch (err) {
          writer.writeActivityToMongo(this.authuser, "Error in startClock: " + err, "user_errors")
          console.log(logHeaders.err + chalk.red("An error occurred: " + err))
          this.stopClock()
        }

      }, 60 * 1000);
    }, timeUntilNextMinute);

  }

  stopClock() {
    clearInterval(this.scheduledClock)
    this.scheduledClock = null
    console.log(logHeaders.info + chalk.green("Stopping clock for: " + this.authuser))
  }

  startOfferClock() {
    //setInterval starting with next minute
    const now = Date.now();
    this.offerClockStartTime = now

    // Calculate the number of milliseconds until the next minute begins
    const timeUntilNextMinute = (60 - new Date(now).getSeconds()) * 1000;

    // Wait until the next minute begins
    console.log("waiting " + timeUntilNextMinute)
    setTimeout(() => {

      // Start the setInterval function to execute the specified function every minute
      this.offerClock = setInterval(() => {
        try {
          console.log("checkin for things to offer on")
          this.checkForOfferTimeMatch()

        } catch (ex) {
          writer.writeActivityToMongo(this.authuser, "Error in startOfferClock: " + err, "user_errors")
          console.log("An error occurred: " + ex)
          this.stopOfferClock()
        }
        console.log('This code will be executed every minute');
      }, 30 * 1000);
    },
      // timeUntilNextMinute
      0
    );

  }

  stopOfferClock() {
    clearInterval(this.offerClock)
    this.offerClock = null
    console.log("STOPPIN CLOCK")
  }

  async checkForTimeMatch() {


    // Get the local time
    const utcTime = new Date();

    // Format the UTC time as a string in "XX:XX" format
    const utcTimeString = `${utcTime.getUTCHours().toString().padStart(2, '0')}:${utcTime.getUTCMinutes().toString().padStart(2, '0')}`;

    // Check if the UTC time matches the time to match
    console.log("Schedule: ", this.schedule, utcTimeString)
    if (this.schedule.includes(utcTimeString)) {
      if (this.isUpdating) {
        console.log(chalk.rgb(255, 165, 0).bold("[WARN] ") + " " + chalk.rgb(255, 165, 0)('Currently refreshing, skipping at:'.utcTimeString))
      }
      else {
        console.log(logHeaders.info + chalk.green("The time matches: " + utcTimeString));
        let failed = await this.doRefresh()
        if (failed) {
          writer.writeActivityToMongo(this.authuser, "Encountered error while refreshing!", "user_activity")
          this.updateActivityBoard(Date.now())
        }

      }


    } else {
      console.log(logHeaders.info + chalk.green("No matches at:  " + utcTimeString, "for", this.username));
    }
  }

  async checkForOfferTimeMatch() {

    const itemsToOfferOn = await offerChecker.checkForLikes(this.username, this.cookies.jwt, this.cookies.ui, this.offerSettings["offerInterval"], this.offerClockStartTime)


    if (itemsToOfferOn.length > 0) {
      try {
        let itemLinks = await offerChecker.getItemPriceAndId(itemsToOfferOn)
        let result = await offerChecker.sendOffersOnItems(itemLinks, this.cookies.jwt, this.cookies.ui, this.offerSettings['discountPercent'], this.offerSettings['shippingDiscount'], this.offerSettings['minimum'], this.offerSettings['basedOff'], this.writer)
        const now = Date.now();
        this.offerClockStartTime = now
      }
      catch (error) {
        writer.writeActivityToMongo(this.authuser, "Error in checkForOfferTimeMatch: " + err, "user_errors")
        console.log(error)
      }
    }
    else {
      console.log("NO LIKED ITEMS FOUND")
    }

  }


  startContinousClock() {

    //setInterval starting with next minute
    const now = Date.now();

    // Calculate the number of milliseconds until the next minute begins
    const timeUntilNextMinute = (60 - new Date(now).getSeconds()) * 1000;

    // Wait until the next minute begins
    console.log("waiting " + timeUntilNextMinute)
    setTimeout(() => {

      // Start the setInterval function to execute the specified function every minute
      this.scheduledClock = setInterval(() => {
        try {
          console.log("checkin for time")
          this.checkForTimeMatch()

        } catch (ex) {
          writer.writeActivityToMongo(this.authuser, "Error in startContinousClock: " + err, "user_errors")
          console.log("An error occurred: " + ex)
          this.stopClock()
        }
        console.log('This code will be executed every minute');
      }, 60 * 1000);
    }, timeUntilNextMinute);

  }



  generateSchedule(prevTime, amount, minDelay, maxDelay) {
    let times = [prevTime]
    for (let i = 1; i <= amount; i++) {
      let num = Math.random() * (maxDelay - 30) + 30
      let newTime = times[i - 1] + (num * 1000 * 60)
      times.push(newTime)
    }
    return times
  }


  startContinuousClock(frequency, minDelay, maxDelay) {

    this.schedule = generateSchedule(Date.now(), frequency, minDelay, maxDelay)

    this.continuousClock = setInterval(() => {



      if (Date.now() >= prevTime + 1000 * 24 * 60 * 60) {
        prevTime = Date.now()
        // console.log('time passed do thing')
      }
      else {
        // console.log('time has not come yet')
      }
    }, 1000)
  }
}


module.exports = { UserOptions: UserOptions }