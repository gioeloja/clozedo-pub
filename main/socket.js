const { Server } = require("socket.io");
const port = 8880
const io = new Server({ path: "/socketio"});
const { MongoClient, ServerApiVersion } = require('mongodb');
const { UserOptions } = require("./src/scripts/va_worker.js");
const salesDataUpdater = require('./src/scripts/update_mongo.js')
const chalk = require('chalk');
const writer = require('./src/scripts/write_activity_mongo.js')
require('dotenv').config();

const logHeaders = {
  mongo: chalk.blue.bold("[MONGO] "),
  info: chalk.green.bold("[INFO] "),
  err: chalk.red.bold("[ERR] "),
  socket: chalk.magenta.bold("[SOCK] ")
}

const mongoURI = process.env.MONGO_URI;
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
userHash = {}
updatingUserHash = {}

function removeUserFromUserHash(authuser)
{
  //in case socket connection is destroyed too early, remove to avoid problems
  console.log('attempting to remove ' + authuser)
  delete userHash[authuser]
  console.log('checking for user in hash: ', userHash[authuser])
}

function removeUserFromUpdatingUserHash(authuser)
{
  //in case socket connection is destroyed too early, remove to avoid problems
  console.log('attempting to remove ' + authuser)
  delete updatingUserHash[authuser]
  console.log('checking for user in hash: ', updatingUserHash[authuser])
}


/* Initialize va_worker so that already active jobs will get going upon socket server initialization */
async function initialize_user() {
  let newUser = new UserOptions(process.env.APP_USER, removeUserFromUserHash);
  userHash[process.env.APP_USER] = newUser 
}

initialize_user()

io.on("connection", (socket) => {
  const forwardedFor = socket.request.headers['x-forwarded-for'];
  const userIpAddress = forwardedFor ? forwardedFor.split(',')[0] : socket.request.connection.remoteAddress;

  socket.on('error', () => {
    console.log('brah')
  })

  socket.on('connectUser', (message) => {
     let authuser = message['authuser']
      console.log(logHeaders.socket + chalk.magenta("Socket connection made for: " + authuser))

      //Check if refresher worker exists
      if (authuser in userHash)
      {
        console.log(logHeaders.socket + chalk.magenta('User', authuser, ' already found in userHash.'))
        //Disconnect existing socket connection and add new one
        userHash[authuser].addSocket(socket)
        console.log("refreshy")
        userHash[authuser].refreshConnection()
      }
      else
      {
        let newUser = new UserOptions(authuser, removeUserFromUserHash);
        newUser.addSocket(socket)
        userHash[authuser] = newUser 
      }
  })
});

// Socket endpoint for refreshing listings once
io.on("connection", (socket) => {
  socket.on('error', () => {
  console.log('brah')
  })

  socket.on('refreshListingsOnce', (message) => {
    let authuser = message['user']
    userHash[authuser].doRefresh()
  })
});

// Socket endpoint for refreshing activity board
io.on("connection", (socket) => {
  socket.on('updateActivityBoard', (message) => {
      let authuser = message['authuser']
      userHash[authuser].updateActivityBoard(Date.now())
  })
});


io.on("connection", (socket) => {
  const forwardedFor = socket.request.headers['x-forwarded-for'];
  const userIpAddress = forwardedFor ? forwardedFor.split(',')[0] : socket.request.connection.remoteAddress;

  socket.on('error', () => {
  console.log('brah')
  })

  socket.on('updateData', async (message) => {
      let authuser = message['authuser']
      console.log(logHeaders.socket + chalk.yellow("Socket connection made for: " + authuser))

      //Check if refresher worker exists
      if (authuser in updatingUserHash)
      {
        console.log(logHeaders.socket + chalk.yellow('User', authuser, ' already found in userHash.'))
        updatingUserHash[authuser] = socket 
        updatingUserHash[authuser].emit("UPDATING")
      }
      else
      {
        updatingUserHash[authuser] = socket 

        // Call update function here
        try {
          console.log(logHeaders.socket + chalk.yellow('Attempting sales data update'))
          writer.writeActivityToMongo(authuser, 'Attempting sales data update', "user_activity")
          await salesDataUpdater.updateMongo(authuser);
          writer.writeActivityToMongo(authuser, 'Updating done', "user_activity")
          console.log(logHeaders.socket + chalk.yellow('Updating done'))
        } catch (error) {
          writer.writeActivityToMongo(authuser, 'Updating failed', "user_activity")
          console.log(logHeaders.socket + chalk.yellow('Updating failed'))
          console.error(error);
          throw error; 
        }
        userHash[authuser].updateActivityBoard(Date.now())
        updatingUserHash[authuser].emit("status","UPDATING DONE")
        delete updatingUserHash[authuser]
      }
  })
});





console.log('Listening on: ' + port)
io.listen(8880);


