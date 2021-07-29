const express = require("express");
const bodyParser = require("body-parser");
const dbConfig = require("./dbconfig.js");
const { MongoClient } = require("mongodb");
let ObjectId = require("mongodb").ObjectID;
var cors = require("cors");

// create our express app
const app = express();
app.use(cors());
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
async function connectToProducts() {
  await client.connect();
  const products = client.db("demo").collection("products");
  return {
    products
  };
}

async function connectToCart() {
  await client.connect();
  const cart = client.db("demo").collection("cart");
  return {
    cart
  };
}

//firstname,lastname,username,password
app.post("/register", async function(req, res) {
  let body = req.body;

  if (!body.firstName) {
    res.send({ msg: "firstname is missing" });
  }

  if (!body.lastName) {
    res.send({ msg: "lastname is missing" });
  }

  if (!body.username) {
    res.send({ msg: "username is missing" });
  }

  if (!body.password) {
    res.send({ msg: "password is missing" });
  }

  const { users } = await connect();
  console.log("Connected to mongodb");

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

app.post("/login", async function(req, res) {
  let body = req.body;

  if (!body.username) {
    res.send({ msg: "username is missing" });
  }

  if (!body.password) {
    res.send({ msg: "password is missing" });
  }
  const { users } = await connect();
  console.log("Connected to mongodb");
  let user = await users.findOne({ username: body.username });
  if (!user) res.send({ msg: "username doesn't exist" });

  if (user.password !== body.password) {
    res.send({ msg: "please enter correct password" });
  } else {
    user.password = undefined;
    res.send({
      success: true,
      message: "User logged in successfully",
      data: user
    });
  }
});

app.get("/users", async function(req, res) {
  const { users } = await connect();

  await users
    .find({})
    .toArray()
    .then(result => {
      res.send({
        success: true,
        message: "User logged in successfully",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      res.send({
        success: true,
        message: "User not logged in successfully",
        data: err
      });
    });
});
app.put("/users/:id", async function(req, res) {
  let body = req.body;
  let id = req.params.id;

  if (!body.username) {
    res.send({ msg: "username is missing" });
  }
  const { users } = await connect();
  console.log("Connected to mongodb");
  let user = await users.findOne({ _id: ObjectId(id) });
  if (!user) res.send({ msg: "user doesn't exist" });
  await users
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: body },
      { returnOriginal: true }
    )
    .then(result => {
      res.send({
        success: true,
        message: "data updated successfully",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      res.send({
        success: true,
        message: "User not logged in successfully",
        data: err
      });
    });
});
app.get("/users/:id", async function(req, res) {
  let id = req.params.id;
  const { users } = await connect();
  console.log("Connected to mongodb");
  let user = await users.findOne({ _id: ObjectId(id) });
  if (!user) res.send({ msg: "user doesn't exist" });
  else {
    res.send({
      success: true,
      message: "user data sent successfully",
      data: user
    });
  }
});
app.delete("/users/:id", async function(req, res) {
  let id = req.params.id;
  const { users } = await connect();
  console.log("Connected to mongodb");
  let user = await users.findOne({ _id: ObjectId(id) });
  if (!user) res.send({ msg: "user doesn't exist" });
  else {
    await users.deleteOne({ _id: ObjectId(id) }).then(result => {
      res.send({
        success: true,
        message: "user deleted successfully",
        data: {}
      });
    });
  }
});

app.post("/product/create", async function(req, res) {
  let body = req.body;

  if (!body.title) {
    res.send({ msg: "title is missing" });
  }

  if (!body.brand) {
    res.send({ msg: "brand is missing" });
  }

  if (!body.price) {
    res.send({ msg: "price is missing" });
  }

  if (!body.description) {
    res.send({ msg: "description is missing" });
  }

  if (!body.image) {
    res.send({ msg: "image is missing" });
  }

  const { products } = await connectToProducts();
  console.log("Connected to mongodb");

  if (await products.findOne({ title: body.title })) {
    res.send({ msg: "title is already existing" });
  } else {
    await products
      .insertOne(body)
      .then(result => {
        res.send({
          success: true,
          message: "Product is added successfully",
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

app.get("/products", async function(req, res) {
  const { products } = await connectToProducts();

  await products
    .find({})
    .toArray()
    .then(result => {
      res.send({
        success: true,
        message: "Products fetched successfully",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      res.send({
        success: true,
        message: "User not logged in successfully",
        data: err
      });
    });
});
app.put("/product/:id", async function(req, res) {
  let body = req.body;
  let id = req.params.id;

  if (!body.title) {
    res.send({ msg: "title is missing" });
  }
  const { products } = await connectToProducts();
  console.log("Connected to mongodb");
  let product = await products.findOne({ _id: ObjectId(id) });
  if (!product) res.send({ msg: "product doesn't exist" });
  await products
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: body },
      { returnOriginal: true }
    )
    .then(result => {
      res.send({
        success: true,
        message: "product data updated successfully",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      res.send({
        success: true,
        message: "updation failed",
        data: err
      });
    });
});
app.get("/", (req, res) => {
  res.json({
    message: "Application is running "
  });
});

app.get("/cart/:id", async function(req, res) {
  const { cart } = await connectToCart();

  let id = req.params.id;
  console.log("Connected to mongodb");
  let cartData = await cart.findOne({ user_id: id });
  if (cartData)
    res.send({
      success: true,
      message: "cart data sent successfully",
      data: cartData
    });
  else {
    let body = {
      user_id: id,
      quantity: 0
    };
    await cart
      .insertOne(body)
      .then(result => {
        res.send({
          success: true,
          message: "cart data sent successfully",
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

app.post("/cart/:id", async function(req, res) {
  const { cart } = await connectToCart();
  let body = req.body;
  let id = req.params.id;
  console.log(body);
  console.log("Connected to mongodb");
  let cartData = await cart.findOne({ _id: ObjectId(id) });
  if (!cartData) res.send({ msg: "cart doesn't exist" });
  else {
    cartData = {
      ...cartData,
      products: body
    };
    await cart
      .updateOne(
        { id: ObjectId(id) },
        { $set: cartData },
        { returnOriginal: true }
      )
      .then(result => {
        res.send({
          success: true,
          message: "cart data sent successfully",
          data: result
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

//start server
app.listen(3000, () => {
  console.log("listening at port:3000");
});

// .then .catch()
