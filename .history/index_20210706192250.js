var express = require("express");
var app = express();

app.get("/", function(req, res) {
  res.send("hello world");
});

app.get("/heartbeat", function(req, res) {
  res.send("server is up and running");
});

app.listen(2000, function() {
  console.log("app is running");
});
ß;
