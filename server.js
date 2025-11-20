const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const csvjson = require('csvjson');

const app = express();
const PORT = 8080;

const uri = "mongodb+srv://base-user:baseuser@gameboy-games.0ol2dth.mongodb.net/?appName=gameboy-games";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function connectToMongo() {
    await client.connect();
    console.log("Spojeno na MongoDB!");
}
connectToMongo();

var path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dumpovi', express.static('gameboy-igre-dump'));
const basePath = path.join(__dirname, 'gameboy-igre-dump', 'gameboy-igre.bson');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/datatable', (req, res) => {
    res.render('datatable.html');
});

app.get('/api/igre', async (req, res) => {
    try {
        const db = client.db('gameboy-games');
        const kolekcija = db.collection('gb-games');

        const docs = await kolekcija.find({}).toArray();
        res.json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Greška pri dohvaćanju igara.' });
    }
});

app.post("/filter", async (req, res) => {
    try {
        const { key, value } = req.body;

        if (!value || value.trim() === "") {
            const docs = await client
                .db("gameboy-games")
                .collection("gb-games")
                .find({})
                .toArray();
            return res.json(docs);
        }

        const val = value.trim().toLowerCase();
        const broj = Number(value);
        const jeBroj = !isNaN(broj);
        const bool = val === "da" ? true : val === "ne" ? false : null;

        const regex = new RegExp(val, "i");

        const col = client.db("gameboy-games").collection("gb-games");

        if (!key) {
            const query = {
                $or: [
                    { naziv: { $regex: regex } },
                    { regija: { $regex: regex } },
                    { izdavac: { $regex: regex } },
                    { platforma: { $regex: regex } },
                    { CRC: { $regex: regex } },
                    ...(jeBroj ? [
                        { godina: broj },
                        { velicina_KB: broj },
                        { broj_igraca: broj }
                    ] : []),
                    { zanr: { $elemMatch: { $regex: regex } } },
                    { varijante: { $elemMatch: { regija: regex } } },
                    ...(jeBroj ? [{ varijante: { $elemMatch: { godina: broj } } }] : []),
                    ...(bool !== null ? [{ spremanje: bool }] : [])
                ]
            };

            const docs = await col.find(query).toArray();
            return res.json(docs);
        }

        let query = {};

        if (["godina", "velicina_KB", "broj_igraca"].includes(key)) {
            if (jeBroj) query[key] = broj;
        }

        else if (key === "spremanje") {
            if (bool !== null) query[key] = bool;
            else return res.status(400).json({ error: "Vrijednost mora biti DA ili NE." });
        }

        else if (key === "zanr") {
            query[key] = { $elemMatch: { $regex: regex } };
        }

        else if (key === "varijante") {
            query.$or = [
                { "varijante.regija": { $regex: regex } },
                ...(jeBroj ? [{ "varijante.godina": broj }] : [])
            ];
        }

        else {
            query[key] = { $regex: regex };
        }

        const docs = await col.find(query).toArray();
        res.json(docs);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Greška u filtraciji" });
    }
});


app.post('/filter-export', (req, res) => {
    const { format, data } = req.body;

    if (!data || !Array.isArray(data))
        return res.status(400).send("Neispravni podaci!");

    if (format === 'CSV') {
        const csvData = csvjson.toCSV(data, { headers: 'key' });

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=filtrirano.csv");

        return res.send(csvData);
    }

    const jsonData = JSON.stringify(data, null, 2);

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=filtrirano.json");

    return res.send(jsonData);
});

app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
