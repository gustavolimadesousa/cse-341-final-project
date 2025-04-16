const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Function to get all products from the database
// and send them as a JSON response

const getAllProducts = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .find();
    results.toArray().then((products) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(products);
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to get a single product by ID from the database
// and send it as a JSON response

const getSingleProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .find({ _id: productId });
    result.toArray().then((product) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(product[0]);
    });
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to create a new product in the database
// and send the created product as a JSON response
const createProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const product = req.body;
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .insertOne(product);
    if (result.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(result.error || "Some error occurred while creating the product");
    }
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to update a product by ID in the database
// and send the updated product as a JSON response
const updateProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);
    const product = req.body;

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .replaceOne({ _id: productId }, product);
    if (result.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(result.error || "Some error occurred while updating the product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to delete a product by ID from the database
// and send a success message as a JSON response
const deleteProduct = async (req, res) => {
  //#swagger.tags = ['Products']
  try {
    const productId = new ObjectId(req.params.id);

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .deleteOne({ _id: productId }, true);
    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(result.error || "Some error occurred while deleting the product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
