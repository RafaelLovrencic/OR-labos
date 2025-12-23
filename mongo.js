const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://base-user:baseuser@gameboy-games.0ol2dth.mongodb.net/?appName=gameboy-games";

const client = new MongoClient(uri, {
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