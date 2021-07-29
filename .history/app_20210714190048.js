const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbconfig.js");
const { MongoClient } = require("mongodb");
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const client = new MongoClient(dbConfig.url);

async function connect() {
  await client.connect();
  const notes = client.db("demo").collection("notes");
  return {
    notes
  };
}

app.get("/", (req, res) => {
  res.json({
    message: "Application is running "
  });
});

app.get("/notes/getall", async function(req, res) {
  const { notes } = await connect();
  let result;
  await notes
    .find()
    .toArray()
    .then(res => {
      console.log(res);
      result = res;
    })
    .catch(err => {
      console.log(err);
    });

  res.send(result);
});

app.post("/notes/insert", async function(req, res) {
  const { notes } = await connect();
  let result;
  await notes
    .insertOne(req.body)
    .then(res => {
      result = res;
    })
    .catch(err => {
      console.log(err);
    });

  res.send(result);
});
//start server
app.listen(3000, () => {
  console.log("listening at port:3000");
});
