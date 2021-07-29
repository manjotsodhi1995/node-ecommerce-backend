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
  const database = client.db("demo");
  const notes = database.collection("notes");
  return {
    database,
    notes
  };
}

// const client = new MongoClient(dbConfig.url);
// async function run() {
//   await client.connect();
//   const database = client.db("demo");
//   const notes = database.collection("notes");
//   var myobj = {
//     name: "Company Inc",
//     address: "Highway 37",
//     image: "https://www.industrialempathy.com/img/remote/ZiClJf-1280w.avif"
//   };
//   notes.insertOne(myobj, function(err, res) {
//     console.log("1 document inserted");
//   });

//   notes.findOne({}, (err, result) => {
//     console.log(result);
//   });
//   // Ensures that the client will close when you finish/error
//   await client.close();
// }
// run().catch(console.dir);
// // define a simple route

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
    });

  res.send(result);
});
//start server
app.listen(3000, () => {
  console.log("listening at port:3000");
});
