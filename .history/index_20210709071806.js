var express = require("express");
const fs = require("fs");
const app = express();
//this line is required to parse the request body
app.use(express.json());

app.get("/", function(req, res) {
  res.send("hello world");
});

app.get("/user/list", (req, res) => {
  const users = getUserData();
  res.send(users);
});
/* Create - POST method */
app.post("/user/add", (req, res) => {
  //get the existing user data
  const existUsers = getUserData();

  //get the new user data from post request
  const userData = req.body;
  //check if the userData fields are missing
  if (
    userData.fullname == null ||
    userData.age == null ||
    userData.username == null ||
    userData.password == null
  ) {
    return res.status(401).send({ error: true, msg: "User data missing" });
  }

  //check if the username exist already
  const findExist = existUsers.find(
    user => user.username === userData.username
  );
  if (findExist) {
    return res.status(409).send({ error: true, msg: "username already exist" });
  }
  //append the user data
  existUsers.push(userData);
  //save the new user data
  saveUserData(existUsers);
  res.send({ success: true, msg: "User data added successfully" });
});
//read the user data from json file
const saveUserData = data => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("users.json", stringifyData);
};
//get the user data from json file
const getUserData = () => {
  const jsonData = fs.readFileSync("users.json");
  return JSON.parse(jsonData);
};

app.listen(3000, function() {
  console.log("app is running");
});
