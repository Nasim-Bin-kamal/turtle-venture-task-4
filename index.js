const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express();

//middleware
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Hello!! Turtle venture API SERVER !!!");
});

app.listen(port, () => {
    console.log("Listening from port:", port);
});