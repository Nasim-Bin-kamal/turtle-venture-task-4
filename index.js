const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();

//middleware
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1k969.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db('turtleDB');
        const stationCollection = database.collection('stations');


        //GET API for all stations
        app.get('/products', async (req, res) => {
            const cursor = stationCollection.find({});
            const stations = await cursor.toArray();
            res.json(stations);
        });

        //Create API for adding a new station
        app.post('/stations', async (req, res) => {
            const newStation = req.body;
            console.log(newStation);
            const result = await stationCollection.insertOne(newStation);
            res.json(result);
        });

        //UPDATE API for update a station
        app.put('/stations/update/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStation = req.body;
            // console.log(updatedStation);
            const filter = { _id: ObjectId(id) };
            const updateDoc = { $set: updatedStation }
            const result = await stationCollection.updateOne(filter, updateDoc);
            res.json(result);

        });

        //DELETE API for delete a station
        app.delete('/stations/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await stationCollection.deleteOne(query);
            res.json(result);
        });
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello!! Turtle venture API SERVER !!!");
});

app.listen(port, () => {
    console.log("Listening from port:", port);
});