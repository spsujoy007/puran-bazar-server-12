const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ke0m0t.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const usedPhoneCollection = client.db('puranbazar').collection('phonesCollection');

        app.get('/usedphones', async(req, res) => {
            const query = {};
            const result = await usedPhoneCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/usedphones/:category', async(req,res)=>{
            const category = req.params.category;
            const query = {category: (category)};
            const result = await usedPhoneCollection.findOne(query)
            console.log("Category", result)
            res.send(result)
        });


    }

    finally{

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})