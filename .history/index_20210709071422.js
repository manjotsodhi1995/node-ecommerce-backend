var express = require("express");
const fs = require("fs");
const app = express();
//this line is required to parse the request body
app.use(express.json());

app.get("/", function(req, res) {
  res.send("hello world");
});

app.listen(200, function() {
  console.log("app is running");
});
