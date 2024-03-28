const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

async function update_settings_mongo(username, settings, field) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    const db = client.db("user_settings");
    await client.connect()
    console.log('CONNECTED')
    try {
        const collection = db.collection(username);
        await collection.updateOne(
            {}, // find the document with the same type
            { $set: { [field]: settings} }, // update the entire document with the new settings
            { upsert: true } // create a new document if it doesn't exist
        );
        return `Settings with type ${settings.type} were updated/created successfully`;
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        await client.close();
    }
}





module.exports = {
	update_settings_mongo: update_settings_mongo
  };