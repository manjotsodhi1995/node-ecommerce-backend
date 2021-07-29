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
const notes = require("./model.js")(mongoose);
app.post("/notes", (req, res) => {
  // Validate request
  if (!req.body.content) {
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
  note
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Note."
      });
    });
});

// Retrieve all Notes
app.get("/notes", (req, res) => {
  Note.find()
    .then(notes => {
      res.send(notes);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving notes."
      });
    });
});

// listen for requests
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = {
      category: req.body.categoryId,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      productImage: req.file.filename,
      quantity: req.body.quantity
    };
    //const newProduct = await createProductObj(req);
    const product = await Product.create(newProduct);
    return res
      .status(200)
      .send({ message: "User created successfully!", product });
  } catch (error) {
    if (error.code === 11000)
      return res.status(200).send({ message: "product already exist" });
    return res.status(400).send({ message: "unable to create product", error });
  }
};

exports.updateProduct = async (req, res, next) => {
  const filter = { _id: req.body.id };
  await Product.findByIdAndUpdate(filter, update);
};

exports.getProducts = (req, res, next) => {
  const pageNo = parseInt(req.query.pageNo);
  const size = 3;

  if (pageNo <= 0) {
    return res
      .status(200)
      .send({ error: true, message: "invalid page number" });
  }

  const query = {
    //skip = size * (pageNo - 1),
    //limit = size,
  };

  Product.find({}, {}, query)
    .select("-_id -__v -updatedAt")
    .populate("category", "-_id name")
    .exec((err, products) => {
      if (err) return res.status(400).send({ message: "showing order", err });
      return res
        .status(200)
        .send({ message: "showing all orders in the cart", products });
    });
};
