const { MongoClient, ServerApiVersion } = require('mongodb');
const moment = require('moment-timezone');
require('dotenv').config();
const uri = process.env.MONGO_URI;

async function setupMongo (clozedoUsername)
{
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()
    console.log('CONNECTED')
        try {
            // user_activity setup
            let database = client.db("user_activity");
            let collections = await database.listCollections().toArray();
            let connectionNames = []
            collections.forEach(collection => {
                connectionNames.push(collection.name);
            });
            
            if (connectionNames.includes(clozedoUsername)) {
                await database.collection(clozedoUsername).drop();
                
            }
            const currentTimeUTC = moment().utc().format('YYYY-MM-DD HH:mm:ss');
            const result = await database.collection(clozedoUsername).insertOne({ [currentTimeUTC]: "User initialized" });

            // user_sales_data setup
            database = client.db("user_sales_data");
            collections = await database.listCollections().toArray();
            connectionNames = []
            collections.forEach(collection => {
                connectionNames.push(collection.name);
            });
            
            if (connectionNames.includes(clozedoUsername)) {
                await database.collection(clozedoUsername).drop();
                
            }
            await database.createCollection(clozedoUsername);

            // user_sales_data setup
            database = client.db("user_settings");
            collections = await database.listCollections().toArray();
            connectionNames = []
            collections.forEach(collection => {
                connectionNames.push(collection.name);
            });
            
            if (connectionNames.includes(clozedoUsername)) {
                await database.collection(clozedoUsername).drop();
            }
            await database.collection(clozedoUsername).insertOne({"userInfo":{},"scheduleSettings":{"numberTimes":{"$numberInt":"0"},"firstEntries":[],"secondEntries":[],"sharingOrder":{"$numberInt":"0"},"sharingSpeed":{"$numberInt":"0"},"enabled":false},"continuousSettings":{"frequency":"1","firstIntervalBound":{"$numberInt":"30"},"secondIntervalBound":{"$numberInt":"60"},"sharingOrder":{"$numberInt":"0"},"sharingSpeed":{"$numberInt":"1"},"enabled":false},"updatingData":"false","dataVersion": 0,"offerSettings":{"discountPercent":"10","offerInterval":"5","shippingDiscount":{"$numberInt":"0"},"basedOff":{"$numberInt":"1"},"minimum":"15","enabled":false}});


            
        } catch (err) {
        console.error(err);
        } finally {
        await client.close();
        }
}


module.exports = {
	setupMongo: setupMongo
  };