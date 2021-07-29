const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbconfig.js");
const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const client = new MongoClient(dbConfig.url, { useUnifiedTopology: true });
async function connect() {
  await client.connect();
  const users = client.db("demo").collection("users");
  return {
    users
  };
}

// firstname ,lastname,username,password

app.post("/register", async function(req, res) {
  const { users } = await client.connect();
  console.log("Connected to mongodb");
  let body = req.body;

  if (!body) {
    res.statusCode(400).json({ msg: "Body is missing" });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Application is running "
  });
});

//start server
app.listen(3000, () => {
  console.log("listening at port:3000");
});

// .then .catch()
