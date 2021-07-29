var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
app.get("/", function(req, res) {
  res.send("hello world");
});

app.get("/heartbeat", function(req, res) {
  res.send("server is up and running");
});
app.post("/welcome", function(req, res) {
  let person = req.body.name;
  res.send("Welcome " + person);
});

app.listen(2000, function() {
  console.log("app is running");
});
