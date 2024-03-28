const closetParser = require('./closet_parser.js')
const { MongoClient, ServerApiVersion } = require('mongodb');
const salesPageParser = require('./sales_page_parser.js');
const { ObjectId } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGO_URI;

async function updateMongo (clozedoUsername)
{
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
    await client.connect()
    console.log('CONNECTED')
        try {
            var time = Date.now()
            const salesCollection = client.db("user_sales_data").collection(clozedoUsername);
            const settingsCollection = client.db("user_settings").collection(clozedoUsername);
            const bundleCollection = client.db("user_bundles_data").collection(clozedoUsername);
            
            // Set status to updating
            await settingsCollection.updateOne({}, { $set: { updatingData: 'true' } });
            
            const settingsInfo = await settingsCollection.find().toArray();
            const cookies = settingsInfo[0].userInfo.cookies;
            const poshUsername = settingsInfo[0].userInfo.username;
            const dataVersion = settingsInfo[0].hasOwnProperty('dataVersion') ? settingsInfo[0].dataVersion : 0;
            
            const closetAvailableData = await closetParser.getPoshmarkDict(poshUsername, "available");
            const closetSoldData = await closetParser.getPoshmarkDict(poshUsername, "sold_out");
            let closetData = closetAvailableData.concat(closetSoldData)
            var time2 = Date.now();
            
            let salesData = await salesPageParser.getPoshmarkDict(poshUsername, cookies.jwt, cookies.ui, dataVersion);
            var time3 = Date.now();
            if(salesData.length > 0) {
                const bundles = await bundleCollection.insertMany(salesData)
            }
            
            
            // Extract bundles from MongoDB and remove the _id field
            const bundlesFromDB = await bundleCollection.find().toArray();
            const cleanedBundlesFromDB = bundlesFromDB.map(({ _id, ...rest }) => rest);

            salesData = cleanedBundlesFromDB.concat(salesData)
            
            // Merge the closet parser data and sales parser data
            for (const sale of salesData) {
              const picUrl = sale.picUrl;
              delete sale.picUrl;
            
              const matchingClosetEntry = closetData.find((entry) => entry.picUrl === picUrl);
              if (matchingClosetEntry) {
                // Update the corresponding entry in the closetData dictionary
                Object.assign(matchingClosetEntry, sale);
              } 
            }

            // Update the merged data as a whole document in MongoDB
            await salesCollection.deleteMany({}); // Delete all existing documents in the collection

            const result = await salesCollection.insertMany(closetData)
            console.log(`${result.insertedCount} document was inserted`);

            var time4 = Date.now();
            console.log('Sales updating done');

            // Set status to not updating
            await settingsCollection.updateOne(
            {},
            { $set: { updatingData: 'false' } }
            );
            
             console.log("closet parsing done:", time2 - time)
             console.log("sales parsing done:", time3 - time)
             console.log("sales updating done:", time4 - time)
             
    
        } catch (err) {
        console.error(err);
        } finally {
        await client.close();
        }
}




module.exports = {
	updateMongo: updateMongo
  };