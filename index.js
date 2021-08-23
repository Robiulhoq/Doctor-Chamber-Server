const bodyParser = require('body-parser');
const express = require('express')
const app = express()

const port = 5000

app.use(bodyParser.json());
const cors = require('cors')
app.use(cors());




const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bangladesh:bangladesh@cluster0.tx9ov.mongodb.net/doctorChamber?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const allAppoinment = client.db("doctorChamber").collection("allAppoinment");
  // Book appoinment 
  app.post('/addAppoinment', (req, res) => {
    const appoinment = req.body;
    allAppoinment.insertOne(appoinment)
      .then(result =>
        res.send(result)
      )
  })
  app.get('/allAppoinment',(req, res)=>{
    allAppoinment.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/chackAppoinment', (req, res) => {
    const { email } = req.body;
    allAppoinment.find({ email: email })
      .toArray((err, documents) => {
        res.send(documents)
      })

  })

  app.post('/getAppoinmentByDate', (req, res) => {
      const {date} = req.body;
      allAppoinment.find({date: date})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })


  app.delete('/deleteAppoinment', (req, res)=>{
    const {id} = req.body;
    allAppoinment.deleteOne({id: id})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)