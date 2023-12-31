const express = require('express')
const app = express()
const cors = require('cors')
// const jwt = require('jsonwebtoken')
// const cookieParser = require('cookie-parser')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://task-management-c7431.web.app'
    ],
    credentials: true,
}
))
app.use(express.json())
// app.use(cookieParser())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1i934d1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const taskCollection = client.db("taskManagement").collection("tasks")
        const userCollection = client.db("taskManagement").collection("users")
        

       
        
        app.post('/users', async (req, res) => {
            try {
                const item = req.body
                const result = await userCollection.insertOne(item)
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })
        app.post('/tasks', async (req, res) => {
            try {
                const item = req.body
                const result = await taskCollection.insertOne(item)
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.get('/tasks',  async (req, res) => {

            try {
                const result = await taskCollection.find().toArray()
                console.log(result);
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })

        app.get('/tasks/:id', async (req, res) => {
            try {
                const id = req.params.id
                const query = { _id: new ObjectId(id) }
                const result = await taskCollection.findOne(query)
                res.send(result)
            } catch (error) {
                res.send(error)
            }
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Survey is Running")
})

app.listen(port, () => {
    console.log(`Survey is Running on ${port}`);
})
