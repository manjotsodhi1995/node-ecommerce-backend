var express = require("express");
const fs = require("fs");
const app = express();
//this line is required to parse the request body
app.use(express.json());

app.get("/", function(req, res) {
  res.send("hello world");
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
