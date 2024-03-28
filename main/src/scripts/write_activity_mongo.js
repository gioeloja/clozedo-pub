const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
const moment = require('moment-timezone');
require('dotenv').config();
const uri = process.env.MONGO_URI;

async function writeActivityToMongo(clozedoUsername, msgString, databaseName) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  await client.connect()

  try {
    const collection = client.db(databaseName).collection(clozedoUsername);

    const currentTimeUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss');

    const msgData = { [currentTimeUTC]: msgString }
    const result = await collection.insertOne(msgData);
    
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}


module.exports = {
	writeActivityToMongo: writeActivityToMongo
  };