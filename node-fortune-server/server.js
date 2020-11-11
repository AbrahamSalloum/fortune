require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const apiroute = require('./routes/api')

var corsOptions = {
  origin: process.env.URL_ORIGIN,
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/", apiroute)

MongoClient.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
.then(client => {
  const db = client.db('fortunedb');
  app.locals.db = db
  app.listen(5000, "0.0.0.0", () => console.info(`running...`));
}).catch(error => console.error(error));