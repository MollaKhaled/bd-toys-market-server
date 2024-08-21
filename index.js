const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jcr26.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    client.connect();

    const toysCollection = client.db('bd-toys-market').collection('toys');
    const bookingCollection = client.db('bd-toys-market').collection('toyBookings');

  app.get('/toys', async(req, res)=>{
    const cursor = toysCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.get('/toys/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const options = {
      projection: {
        sellerName:1, toyName:1,email:1, price:1, details:1, picture:1,rating:1
      }
    }
    const result = await toysCollection.findOne(query, options);
    res.send(result);
  })
  // toys Booking
  app.get('/toyBookings', async(req, res)=>{
    let query = {};
    if(req.query?.email){
      query = {email:req.query.email}
    }
    const cursor = bookingCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  })

  app.post('/toyBookings', async (req, res) => {
    const booking = req.body;
    const result = await bookingCollection.insertOne(booking);
    res.send(result);
  })




  app.delete('/toyBookings/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await bookingCollection.deleteOne(query);
    res.send(result);
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
  res.send('bd-toys-market!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})