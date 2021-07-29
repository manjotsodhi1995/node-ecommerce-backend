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
  const { users } = await connect();
  console.log("Connected to mongodb");
  let body = req.body;

  if (!body.firstname) {
    res.send({ msg: "firstname is missing" });
  }

  if (!body.lastname) {
    res.send({ msg: "lastname is missing" });
  }

  if (!body.username) {
    res.send({ msg: "username is missing" });
  }

  if (!body.password) {
    res.send({ msg: "password is missing" });
  }

  if (await users.findOne({ username: body.username })) {
    res.send({ msg: "username is already existing" });
  } else {
    await users
      .insertOne(body)
      .then(result => {
        res.send({
          success: true,
          message: "User is registered successfully",
          data: result.ops[0]
        });
      })
      .catch(err => {
        console.log(err);
        res.send({
          success: false,
          message: "Something Went Wrong",
          data: {}
        });
      });
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
