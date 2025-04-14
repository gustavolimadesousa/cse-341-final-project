const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;


// Function to get all products from the database
// and send them as a JSON response
const getAllProducts = async (req, res) => {
 const results = await mongodb.getDatabase().db().collection('products').find();
 results.toArray().then((products) => {
  if (products.length === 0) {
    return res.status(404).json({ error: 'No products found' });
  }
   res.setHeader('Content-Type', 'application/json');
   res.status(200).json(products);
 }).catch((err) => {
   res.status(500).json({ error: err.message });
 });
}


// Function to get a single product by ID from the database
// and send it as a JSON response
const getSingleProduct = async (req, res) => {
const productId = new ObjectId(req.params.id);
const result = await mongodb.getDatabase().db().collection('products').find({ _id: productId });
result.toArray().then((product) => {
  if (product.length === 0) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(product[0]);
}).catch((err) => {
  res.status(500).json({ error: err.message });
});
};

module.exports = {
  getAllProducts,
  getSingleProduct,
};