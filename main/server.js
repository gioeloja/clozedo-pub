var express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI
var app = express();
const port = 4000
const cors = require('cors');

var bodyParser = require('body-parser')
const getUser = require('./src/scripts/getUser.js')
const extracter = require('./src/scripts/extract_mongo.js')
const salesDataUpdater = require('./src/scripts/update_mongo.js')
const settingsUpdater = require('./src/scripts/update_settings_mongo.js');
const cookieValidater = require('./src/scripts/validate_cookies.js');
const mongoSetup = require('./src/scripts/new_user_setup.js')

app.use(cors())
app.set('server.timeout', 240000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/setSalesData', async function(req, res) {
	console.log("/api/setSalesData")
	updateSalesData = await salesDataUpdater.updateMongo(req.body.username)
	res.send(updateSalesData)
})

app.post('/api/getSalesData', async function(req, res) {
	console.log("/api/getSalesData")
	jsonData = await extracter.extract("user_sales_data", req.body.username)
	res.send(jsonData)
	
})

app.post('/api/getSettings', async function(req, res) {
	console.log("/api/getSettings")
	jsonData = await extracter.extract("user_settings", req.body.username)
	res.send(jsonData)
})

app.post('/api/setSettings', async function(req, res) {
	console.log("/api/setSettings")
	updateSettingsData = await settingsUpdater.update_settings_mongo(req.body.username, req.body.settings, req.body.field)
	res.send(updateSettingsData)
})

app.post('/api/validateCookies', async function(req, res) {
	console.log("/api/validateCookies")
	cookieStatus = await cookieValidater.validateCookies(req.body.username)
	res.send(cookieStatus)
})


app.post('/api/getUser', async function(req, res) {
	console.log("/api/getUser")

	let authuser = req.body.authuser
	let mongo_data = await extracter.extract('user_settings', authuser)
	if('userInfo' in mongo_data[0])

	{
		let cookieDict = encryptor.decryptCookies(mongo_data[0].userInfo.cookies, mongo_data[0].userInfo.iv)
		let user = await getUser.getUser(cookieDict.jwt, cookieDict.ui)
		res.send(user)
	}
	else
	{
		res.send({'error': 'aaaa'})
	}
});

app.post('/api/initializeMongo', async function(req, res) {
	console.log("/api/initializeMongo")
	initialize_mongo = await mongoSetup.setupMongo(req.body.username)
})


app.post('/api/cookieGetter/', async function(req, res) {
		console.log('/api/cookieGetter/')
try {

		let data = req.body

		let user = await getUser.getUser(data.jwt, data.ui)

		if(user)
		{
			let authuser = req.body.authuser
			let encrypted_values = {jwt: data.jwt, ui: data.ui, iv: null}//encryptor.encrypt(data.jwt, data.ui)
			let cookieJson = {jwt: encrypted_values.jwt, ui: encrypted_values.ui}
			let updateFields = {username: user, cookieStatus: "true", iv: encrypted_values.iv, cookies: cookieJson}
			updateSettingsData = await settingsUpdater.update_settings_mongo(authuser, updateFields, 'userInfo')
			res.send({accountUser: user})

		}

		else {

			res.send({error: "Unable to link account"})
		}

} catch (error) {
	res.send({error: "Error attempting to link (possible bug)"})
	
}


});


app.post('/api/mongoCheckForUser', async function(req, res) {
	console.log("/api/mongoCheckForUser")
	let authuser = req.body.authuser

	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
	await client.connect()
	console.log('CONNECTED FOR ' + authuser)
	try {
	  const newcollection = client.db('user_settings').collection(authuser);
	  const newresult = await newcollection.find().toArray();
	  console.log(`Found ${newresult.length} documents`);
	  //const jsonData = JSON.stringify(newresult, null, 2); 

	  if(newresult[0].userInfo && 'username' in newresult[0].userInfo && 'cookies' in newresult[0].userInfo){
		let username = newresult[0].userInfo.username
		let cookieStatus = newresult[0].userInfo.cookieStatus

		res.send({notfound: false, username: username, cookieStatus: cookieStatus})

	  }
	  else
	  {
		res.send({notfound: true})
	  }

	} catch (err) {
	  console.error(err);

	  res.send({error: err})
	  return err
	} finally {
	  await client.close();
	  console.log('MONGO DISCONNECTED FOR ' + authuser);
	}
})


app.post('/api/updateMongoUserInfo', async (req, res) =>{
	console.log('/api/updateMongoUserInfo')
	let data = req.body
	let deleteEntry = data.deleteEntry
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
	await client.connect()
		try {
			const collection = client.db("user_settings").collection(req.body.authuser);


			let update;

			if(deleteEntry)
			{
				update = { $set: {userInfo:{}}}
			}
			else
			{	
				update = { $set: { userInfo: {username: req.body.username, cookies: req.body.cookies, cookieStatus: req.body.cookieStatus} } }
			}
			


			const result = await collection.updateOne({}, update, { upsert: true })


			
	
		} catch (err) {
		console.error(err);
		} finally {
		res.send("DONE")
		await client.close();
		}


		
} )


const http = require('http');
const server = http.createServer(app);


server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});