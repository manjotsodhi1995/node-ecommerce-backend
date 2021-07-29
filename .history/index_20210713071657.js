const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbconfig.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// define a simple route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to  application."
  });
});

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });


  app.post('/notes',(req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note", 
        content: req.body.content
    });

    // Save Note in the database
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });

  // Retrieve all Notes
  app.get('/notes',(req, res) => {
    Note.find()
    .then(notes => {
        res.send(notes);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });

  // Retrieve a single Note with noteId
  app.get('/notes/:noteId', notes.findOne);

  // Update a Note with noteId
  app.put('/notes/:noteId', notes.update);

  // Delete a Note with noteId
  app.delete('/notes/:noteId', notes.delete);

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
