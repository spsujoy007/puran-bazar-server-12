const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const usedPhoneCollection = client.db('puranbazar').collection('phonesCollection');
        const userCollection = client.db('puranbazar').collection('users');
        const ordersCollection = client.db('puranbazar').collection('orders');


        //add new product in usedProductCollection
        app.post('/usedphones', async(req, res) => {
            const product = req.body;
            const result = await usedPhoneCollection.insertOne(product);
            console.log(result)
            res.send(result)
        })

        app.get('/usedphones', async(req, res) => {
            const query = {};
            const result = await usedPhoneCollection.find(query).toArray();
            res.send(result)
        });

        

        //for report to admin
        app.put('/usedphones', async(req, res) => {
            const id = req.query.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
            $set: {
              report: true
            }
          }
          const result = await usedPhoneCollection.updateOne(filter, updatedDoc, options)
          res.send(result)
        });

        //get the reported items
        app.get('/reporteditems', async(req, res) => {
            const report = req.query.report;
            const query = {report: (report)};
            const result = await usedPhoneCollection.find(query).toArray();
            res.send(result)
        })

        //get products by the seller
        app.get('/myproducts', async(req, res) => {
            const email = req.query.email;
            const query = {useremail: email};
            const result = await usedPhoneCollection.find(query).toArray();
            res.send(result)
        })

        //Seller can delete an product with deleting // and delete item for reported items 
        app.delete('/myproducts', async(req, res) => {
            const id = req.query.id;
            const query = {_id: ObjectId(id)};
            const result = await usedPhoneCollection.deleteOne(query);
            res.send(result);
        })

        //add booking modal data in mongodb
        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        });

        app.get('/orders', async(req,res) => {
            const useremail = req.query.email;
            const query = {email: (useremail)};
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        })

        //deleting order with handler
        app.delete('/orders', async(req, res) => {
            const id = req.query.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.send(result)
        })

        //clicking or find by category
        app.get('/usedphones/:category', async(req,res)=>{
            const category = req.params.category;
            const query = {category: (category)};
            const result = await usedPhoneCollection.find(query).toArray();
            res.send(result)
        });
        

        //single phone with unic id
        app.get('/phone/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await usedPhoneCollection.findOne(query);
            res.send(result);
        })


        //collection for know the role of user
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        });

        app.get('/users', async(req, res)=> {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        });

        //get user by the useremail for verifing        
        app.get('/users/:email', async(req, res)=> {
            const email = req.params.email;
            const query = {email: email};
            const result = await userCollection.findOne(query);
            res.send(result);
            console.log(result);
        });

        //verify user by put method
        app.put('/users', async(req, res)=> {
            const id = req.query.id;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
            $set: {
              verified: true
            }
          }
          const result = await userCollection.updateOne(filter, updatedDoc, options)
          res.send(result)
        })

    }

    finally{

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
  res.send('Puran Bazar web server')
})

app.listen(port, () => {
  console.log(`Puran bazar web server on port ${port}`)
})