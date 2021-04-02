const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const port = 5000

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mymds.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("order");
  // perform actions on the collection object

  //   Add Products 

  app.post('/addProduct', (req, res) => {
    const products = req.body
    console.log('req');
    res.send('some')
    productsCollection.insertMany(products)
      .then(result => {
        console.log(result.insertedCount)
      }).catch(error => {
        console.log(error.message);
      })
  })
  console.log('Database Connected');


  // Load Products 

app.get('/products',(req,res)=>{
  productsCollection.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

// Load a single Product 

app.get('/product/:key',(req,res)=>{
  console.log(req.params);
  productsCollection.find({key : req.params.key})
  .toArray((err,document)=>{
    res.send(document[0]);
  })
})

// Load Product By Keys 

app.post('/productsByKeys', (req, res) => {
  const productKeys = req.body;
  productsCollection.find({key: { $in: productKeys} })
  .toArray( (err, documents) => {
      res.send(documents);
  })
})

// Place Order 

app.post('/addOrder', (req, res) => {
  const order = req.body
  console.log('req');
  ordersCollection.insertOne(order)
    .then(result => {
      console.log(result.insertedCount)
      res.send(true)
    }).catch(error => {
      console.log(error.message);
    })
})

});



// Home Page 
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)