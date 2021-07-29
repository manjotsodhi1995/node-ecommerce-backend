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

app.get("/user/:id", function(req, res) {
  let headers = req.headers;
  let params = req.query;
  let id = req.params;
  res.send(id);
});

app.post("/post/:userid", function(req, res) {
  let post = req.query;
  let header = req.headers;
  let param = req.params;
  let body = req.body;
  let data = {
    header: header,
    data: post,
    param: param,
    body: body
  };
  res.send(data);
});

app.listen(5000, function() {
  console.log("app is running");
});

// get can contain -> query params, path params & headers
// post request can contain -> query params, path params & headers & body
// put request can contain -> query params, path params & headers & body
// delete can contain -> query params, path params & headers
