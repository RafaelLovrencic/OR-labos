const fs = require('fs');
const { BSON } = require('mongodb');
const express = require('express');
const csvjson = require('csvjson');

const app = express();
const PORT = 8080;

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

app.get('/api/igre', (req, res) => {
    const buffer = fs.readFileSync(basePath);
    const docs = [];
    let offset = 0;

    while (offset < buffer.length) {
        const docSize = buffer.readInt32LE(offset);

        if (docSize <= 0 || offset + docSize > buffer.length) break;

        const docBuffer = buffer.slice(offset, offset + docSize);
        const doc = BSON.deserialize(docBuffer);

        docs.push(doc);
        offset += docSize;
    }

    res.json(docs);
});

app.post('/filter-export', (req, res) => {
    const { format, data } = req.body;

    if (!data || !Array.isArray(data))
        return res.status(400).send("Neispravni podaci!");

    const exportFolder = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportFolder))
        fs.mkdirSync(exportFolder);

    let filePath;

    if (format === 'CSV') {
        const csvData = csvjson.toCSV(data, { headers: 'key' });
        filePath = path.join(exportFolder, `filtrirano.csv`);
        fs.writeFile(filePath, csvData, err => {
            if (err)
                return res.status(500).send("Greška pri spremanju CSV-a!");
        });
    } else {
        filePath = path.join(exportFolder, `filtrirano.json`);
        fs.writeFile(filePath, JSON.stringify(data, null, 2), err => {
            if (err)
                return res.status(500).send("Greška pri spremanju JSON-a!");
        });
    }

    res.json( {stat: "succ"} );
});

app.listen(PORT, () => console.log(`Server radi na portu ${PORT}`));
