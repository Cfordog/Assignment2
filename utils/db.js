const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://assigment1:DyjkWBOrb3p5Hs9o2LcrpucUX6aRL1rxhKShuQpTBQGr3zNUPz6R77wM5g9IrNID0Dv1g5MFy2nEACDb1bVVoQ==@assigment1.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@assigment1@';
if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
    const db = client.db('eventDB');
    db.client = client;
    return db;
}



async function writeDataToMongoDB() {

    const fs = require('fs');

    const jsonFilePath = 'data/test.json';

    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    // Remove the 'id' field from each document
    jsonData.forEach(obj => {
        delete obj.id;
    });
    
    // Write the modified data back to the file
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2));

    // Read JSON data from file
    const jsonData1 = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    // Create a new MongoDB client
    const client = await MongoClient.connect(process.env.MONGODB_URI, { useUnifiedTopology: true });
    try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db('eventDB');

    collectionName = 'event';

    await db.collection(collectionName).drop();

    const collection = db.collection(collectionName);

    // Insert the JSON data into the collection
    const result = await collection.insertMany(jsonData1);

    console.log(`${result.insertedCount} documents inserted into MongoDB.`);

    const count = await collection.countDocuments();

    console.log(`Number of documents in collection '${collectionName}': ${count}`);

  } catch (error) {
    console.error('Error writing data to MongoDB:', error);
  } finally {
    // Close the MongoDB client
    await client.close();
  }
}

// Call the function to write data to MongoDB
writeDataToMongoDB();

module.exports = { connectToDB, ObjectId };