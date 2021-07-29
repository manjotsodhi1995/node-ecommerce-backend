var express = require("express");
var bodyParser = require("body-parser");
var app = express();

let user = {
  name: "hyse academy",
  phone: "92929929922",
  email: "hyse@gmail.com"
};
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

app.get("/user", function(req, res) {
  res.send(user);
});

app.post("/post/:userid", function(req, res) {
  let post = req.query;
  let header = req.headers;
  let param = req.params;
  let data = {
    header: header,
    data: post
    param: param
  };
  res.send(data);
});

app.listen(5000, function() {
  console.log("app is running");
});
