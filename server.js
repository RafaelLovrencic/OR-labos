const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const csvjson = require('csvjson');
const { client, connectToDB } = require('./mongo');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 8080;
const notAuthedResp = `
    <DOCTYPE! html>
    <head>
        <style>
            a {
            font-size: 4vh;
            background: #7EB09B;
            padding: 5px;
            color: #FFEEFF;
            margin: 10px;
            border-radius: 12px;
            text-decoration: none;
        }
        </style>
    </head>
    <body>
        <h1>Ova radnja zahtjeva autentikaciju. Prijavite se!</h1>
        <a href='/login'>Prijava</a>
    </body>
`;

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH_SECRET,
    baseURL: 'http://localhost:8080',
    clientID: 'FmdhgVUHEHuvb5cLJMHjjOG6UkwbwiWl',
    issuerBaseURL: 'https://dev-o2ok4g8zbs1f3b5z.us.auth0.com'
};

const api = require("./routes/api.routes");

var path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dumpovi', express.static('gameboy-igre-dump'));
app.use(auth(authConfig));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/datatable', (req, res) => {
    res.render('datatable.html');
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

app.get('/profile', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.render("profile.html");
    } else {
        res.status(401).send(notAuthedResp);
    }
});

app.get('/user-data', (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json(req.oidc.user);
    } else {
        res.status(401).send(notAuthedResp);
    }
});

app.get('/get-auth-status', (req, res) => {
    res.json({ "status": req.oidc.isAuthenticated() });
});

app.use("/api", api);

try {
    connectToDB();
} catch (err) {
    console.log("Greška pri spajanju na bazu.");
}
app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));