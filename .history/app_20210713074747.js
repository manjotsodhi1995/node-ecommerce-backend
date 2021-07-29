const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./dbconfig.js");
const { MongoClient } = require("mongodb");
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(dbConfig.url);
async function run() {
  await client.connect();
  const database = client.db("demo");
  const movies = database.collection("notes");
  // Query for a movie that has the title 'Back to the Future'
  const query = { title: "Back to the Future" };
  const movie = await movies.findOne(query);
  console.log(movie);

  // Ensures that the client will close when you finish/error
  await client.close();
}
run().catch(console.dir);
// define a simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to  application."
  });
});
//start server
app.listen(3000, () => {
  console.log("listening at port:3000");
});
