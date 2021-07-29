const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./dbconfig.js");
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(dbConfig.url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("demo");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("notes").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});

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
