const express = require('express')
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { config } = require('dotenv');
require('dotenv').config();
const port = process.env.PORT || 5000

// middle waers
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ts14m7y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const foodCollections = client.db('foodCourt').collection('services')
        const reviewCollections = client.db('foodReview').collection('reviews')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = foodCollections.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await foodCollections.findOne(query);
            res.send(service);

        })


        app.get('/service-home', async(req, res)=>{
            const query = {}
            const cursor = foodCollections.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        app.post('/service', async (req, res)=>{
            const service = req.body;
            const result = await foodCollections.insertOne(service);
            res.send(result)
        })


        // Reviews
        app.get('/reviews', async (req, res)=>{
            let query = {}
            if(req.query.email) {
                query = {
                    email : req.query.email
                }
            }
            const cursor = reviewCollections.find(query);
            const review = await cursor.toArray();
            res.send(review)
            console.log(query);
        })


        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            const result = await reviewCollections.insertOne(review);
            res.send(result)
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body.status;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    text: status
                }
            }
            const result = await reviewCollections.updateOne(query, updateDoc)
            res.send(result)
        })
           
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollections.deleteOne(query);
            res.send(result)
        })

    }
    finally {

    }
}

run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send("Food COURT SERVER IS RUNNING")
})


app.listen(port, () => {
    console.log(`Food court is running on ${port}`);
})