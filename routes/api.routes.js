const express = require('express');
const { connectToDB }= require('../mongo');
const { ObjectId } = require('mongodb');
const openapi = require('../api-docs');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const router = express();

router.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));

router.get('/test', (req, res) => { res.render('api_test.html'); });

router.get('/v1/openapi-specification', (req, res) => {
    try {
        const filePath = path.join(process.cwd(), "public", "openapi.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        const spec = JSON.parse(raw);

        res.status(200).json({
            status: "OK",
            message: "Poslana OpenAPI specifikacija",
            response: spec
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Internal Server Error",
            message: "Greška pri dohvaćanju OpenAPI specifikacije",
            response: null
        });
    }
});

router.get('/v1/igre', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection('gb-games');

        const docs = await kolekcija.find({}).toArray();

        res.status(200).json({
            "status": "OK",
            "message": "Dohvacena baza",
            "response": docs
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dohvacanju igara",
            "response": null
        });
    }
});

router.get("/v1/igre/:id", async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                "status": "Bad Request",
                "message": "ID nije valjan",
                "response": null
            });
        }

        const doc = await kolekcija.findOne({ _id: new ObjectId(id) });

        if (!doc) {
            return res.status(404).json({
                "status": "Not Found",
                "message": "Ne postoji igra s tim ID-jem",
                "response": null
            });
        }

        res.status(200).json({
            "status": "OK",
            "message": `Dohvacen objekt s ID-jem ${id}`,
            "response": doc
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dohvacanju zapisa.",
            "response": null
        });
    }
});

router.get("/v1/igre/naziv/:naziv", async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const naziv = req.params.naziv;

        const doc = await kolekcija.findOne({ naziv: naziv });

        if (!doc) {
            return res.status(404).json({
                status: "Not Found",
                message: "Ne postoji igra s tim nazivom",
                response: null
            });
        }

        res.status(200).json({
            status: "OK",
            message: `Dohvaćen objekt s nazivom ${naziv}`,
            response: doc
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Internal Server Error",
            message: "Greška pri dohvaćanju zapisa.",
            response: null
        });
    }
});

router.get('/v1/igre/platforma/GB', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const docs = await kolekcija.find({ platforma: "Game Boy" }).toArray();

        res.status(200).json({
            "status": "OK",
            "message": "Dohvacene igre za GameBoy",
            "response": docs
        });
    } catch (err) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dohvacanju GameBoy igara",
            "response": null
        });
    }
});

router.get('/v1/igre/platforma/GBC', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const docs = await kolekcija.find({ platforma: "Game Boy Color" }).toArray();
        res.status(200).json({
            "status": "OK",
            "message": "Dohvacene igre za GameBoy Color",
            "response": docs
        });
    } catch (err) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dohvacanju GameBoy igara",
            "response": null
        });
    }
});

router.get('/v1/igre/platforma/GBA', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const docs = await kolekcija.find({ platforma: "Game Boy Advance" }).toArray();
        res.status(200).json({
            "status": "OK",
            "message": "Dohvacene igre za GameBoy Advance",
            "response": docs
        });
    } catch (err) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dohvacanju GameBoy igara",
            "response": null
        });
    }
});

router.post('/v1/igre/noviUnos', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");
        
        const doc = req.body;
        
        const postojeci = await kolekcija.find({ naziv: doc.naziv, godina: doc.godina, CRC: doc.CRC, platforma: doc.platforma }).toArray();
        if (postojeci.length !== 0) {
            res.status(400).json({
                "status": "Bad Request",
                "message": "Ovaj je element vec u bazi.",
                "response": postojeci
            });
            
            return;
        }

        const rezultat = await kolekcija.insertOne(doc);
        const noviDoc = await kolekcija.findOne({ _id: rezultat.insertedId });

        res.status(201).json({
            "status": "Created",
            "message": `Uspjesno dodan element s ID-jem: ${rezultat.insertedId}`,
            "response": noviDoc
        });
    } catch (err) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri dodavanju igre",
            "response": null
        });
    }
});

router.put('/v1/igre/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const id = req.params.id;
        const doc = { ...req.body };

        const rezultat = await kolekcija.updateOne(
            { _id: new ObjectId(id) },
            { $set: doc }
        );

        if (rezultat.matchedCount === 0) {
            return res.status(404).json({
                status: "Not Found",
                message: "Ne postoji igra s tim ID-jem",
                response: null
            });
        }

        const updateIgra = await kolekcija.findOne({ _id: new ObjectId(id) });
        res.status(200).json({
            status: "OK",
            message: "Igra uspjesno azurirana",
            response: updateIgra
        });

    } catch (err) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "Greška pri uređivanju atributa igre",
            response: null
        });
    }
});

router.delete('/v1/igre/:id', async (req, res) => {
    try {
        const db = await connectToDB();
        const kolekcija = db.collection("gb-games");

        const id = req.params.id;

        const rezultat = await kolekcija.deleteOne({ _id: new ObjectId(id) });

        if (rezultat.deletedCount === 1) {
            res.status(200).json({
                "status": "OK",
                "message": `Uspjesno obrisan element s ID-jem: ${id}`,
                "response": null
            });
        } else {
            res.status(400).json({
                "status": "Bad Request",
                "message": `Ne postoji element s ID-jem: ${id}`,
                "response": null
            });
        }
    } catch (err) {
        res.status(500).json({
            "status": "Internal Server Error",
            "message": "Greska pri brisanju igre",
            "response": null
        });
    }
});

router.use((req, res) => {
    res.status(501).json({
        "status": "Not Implemented",
        "message": "Trazena API ruta ne postoji",
        "response": null
    });
});

module.exports = router;