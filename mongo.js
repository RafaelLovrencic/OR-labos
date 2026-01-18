const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGO_URL;

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

let db;

async function connectToDB() {
    if (db) return db;

    await client.connect();
    db = client.db("gameboy-games");

    console.log("Spojeno na MongoDB");
    return db;
}

module.exports = {
    connectToDB,
    client
};