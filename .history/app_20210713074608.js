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
