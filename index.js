const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


//middleware
app.use(cors());
app.use(express.json());

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Tutle API Server',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'https://sheltered-castle-17740.herokuapp.com'
            }
        ]
    },
    apis: [
        './index.js'
    ]
}

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1k969.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const database = client.db('turtleDB');
        const stationCollection = database.collection('stations');

        /**
         * @swagger
         *  components:
         *      schemas:
         *          station:
         *                  type: object
         *                  properties:
         *                          id:
         *                            type: integer
         *                          stationName:
         *                                 type: string
         *                          frequency:
         *                                 type: string
         */

        /** 
         * @swagger 
         * /stations:
         *   get: 
         *     description: This api is used to fetch data from mongoDB
         *     responses:  
         *       200: 
         *         description: Success
         *         content:
         *              application/json:
         *                  schema:
         *                      type: array
         *                      items:
         *                          $ref: '#components/schemas/station'                      
         */
        //GET API for all stations
        app.get('/stations', async (req, res) => {
            const cursor = stationCollection.find({});
            const stations = await cursor.toArray();
            res.json(stations);
        });

        /** 
         * @swagger 
         * /stations/addStation:
         *   post: 
         *     description: This api is used to post station data to mongoDB
         *     requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      $ref: '#components/schemas/station' 
         *     responses:
         *         200:
         *              description: Added Successfully                  
         */

        //Create API for adding a new station
        app.post('/stations/addStation', async (req, res) => {
            const newStation = req.body;
            console.log(newStation);
            const result = await stationCollection.insertOne(newStation);
            res.json(result);
        });

        /** 
         * @swagger 
         * /stations/update/{id}:
         *   put: 
         *     description: This api is used to update station data to mongoDB
         *     parameters:
         *          - in : path
         *            name: id
         *            required: true
         *            description: Integer id required
         *            scheme:
         *              type: integer
         *     requestBody:
         *          required: true
         *          content:
         *              application/json:
         *                  schema:
         *                      type: array
         *                      $ref: '#components/schemas/station'
         *     responses:
         *         200:
         *              description: Updated Successfully
         *              content:
         *                  application/json:
         *                          schema:
         *                              type: array
         *                              items: 
         *                                  $ref: '#components/schemas/station'                       
         */

        //UPDATE API for update a station
        app.put('/stations/update/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const updatedStation = req.body;
            // console.log(updatedStation);
            const filter = { id: id };
            const updateDoc = { $set: updatedStation }
            const result = await stationCollection.updateOne(filter, updateDoc);
            res.json(result);

        });


        /** 
         * @swagger 
         * /stations/delete/{id}:
         *   delete: 
         *     description: This api is used to delete a station data from mongoDB
         *     parameters:
         *          - in : path
         *            name: id
         *            required: true
         *            description: Integer id required
         *            scheme:
         *              type: integer
         *     responses:
         *         200:
         *              description: Deleted Station Successfully                 
         */
        //DELETE API for delete a station
        app.delete('/stations/delete/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { id: id };
            // console.log(query);
            const result = await stationCollection.deleteOne(query);
            res.json(result);
        });


    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);



/** 
 * @swagger 
 * /:
 *   get: 
 *     description: check get api
 *     responses:  
 *       200: 
 *         description: Success  
 *   
 */
app.get("/", (req, res) => {
    res.send("Hello!! Turtle venture API SERVER !!!");
});

app.listen(port, () => {
    console.log("Listening from port:", port);
});