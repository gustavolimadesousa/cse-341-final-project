const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


// Function to get all products from the database
// and send them as a JSON response

const getAllProducts = async (req, res) => {
  const results = await mongodb.getDatabase().db().collection('products').find();
  results.toArray().then((products) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
  });
}


// Function to get a single product by ID from the database
// and send it as a JSON response

const getSingleProduct = async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("products")
    .find({ _id: productId });
  result
    .toArray()
    .then((product) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(product[0]);
    });
};


// Function to create a new product in the database
// and send the created product as a JSON response
const createProduct = async (req, res) => {
  const product = req.body;
  const result = await mongodb
    .getDatabase()
    .db()
    .collection("products")
    .insertOne(product);
    if (result.acknowledged) {
      res.status(204).send();
    }
    else {
      res.status(500).json(result.error || "Some error occurred while creating the product" );
    };
  };

  // Function to update a product by ID in the database
  // and send the updated product as a JSON response
  const updateProduct = async (req, res) => {
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
      res.status(500).json(result.error || "Some error occurred while updating the product");
    }
  };

  // Function to delete a product by ID from the database
  // and send a success message as a JSON response
  const deleteProduct = async (req, res) => {
    const productId = new ObjectId(req.params.id);
  
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("products")
      .deleteOne({ _id: productId }, true);
    if (result.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(result.error || "Somme error occurred while deleting the product");
    }
  };


module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct

};