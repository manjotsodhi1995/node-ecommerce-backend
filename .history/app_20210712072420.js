const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const dataPath = "./account.json"; // path to our JSON file
// create our express app
const app = express();
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/account/addaccount", (req, res) => {
  var existAccounts = getAccountData();
  const newAccountId = Math.floor(100000 + Math.random() * 900000);

  existAccounts[newAccountId] = req.body;

  console.log(existAccounts);
  saveAccountData(existAccounts);
  res.send({ success: true, msg: "account added successfully" });
});

// Read - get all accounts from the json file
app.get("/account/list", (req, res) => {
  const accounts = getAccountData();
  res.send(accounts);
});

// Update - using Put method
app.put("/account/:id", (req, res) => {
  var existAccounts = getAccountData();
  fs.readFile(
    dataPath,
    "utf8",
    (err, data) => {
      const accountId = req.params["id"];
      existAccounts[accountId] = req.body;
      saveAccountData(existAccounts);
      res.send(`accounts with id ${accountId} has been updated`);
    },
    true
  );
});

// delete - using delete method
app.delete("/account/delete/:id", (req, res) => {
  fs.readFile(
    dataPath,
    "utf8",
    (err, data) => {
      var existAccounts = getAccountData();
      const userId = req.params["id"];
      delete existAccounts[userId];
      saveAccountData(existAccounts);
      res.send(`accounts with id ${userId} has been deleted`);
    },
    true
  );
});

// util functions
const saveAccountData = data => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync("account.json", stringifyData);
};
const getAccountData = () => {
  const jsonData = fs.readFileSync("account.json");
  return JSON.parse(jsonData);
};
//start server
app.listen(3000, () => {
  console.log("listeniing at port:3000");
});
