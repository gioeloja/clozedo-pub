const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

async function extract(database, user) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  await client.connect()
  console.log('CONNECTED')
  try {
    const newcollection = client.db(database).collection(user);
    const newresult = await newcollection.find().toArray();
    console.log(`Found ${newresult.length} documents`);
    const jsonData = JSON.stringify(newresult, null, 2); 
    return newresult
  } catch (err) {
    console.error(err);
    return err
  } finally {
    await client.close();
    console.log('DISCONNECTED');
  }
}

module.exports = {
	extract: extract
  };