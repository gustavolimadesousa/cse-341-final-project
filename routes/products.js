const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');
const { isAuthenticated } = require("../middleware/authenticate");

// GET all products
router.get('/', productsController.getAllProducts); 

// GET a single product by ID
router.get('/:id', productsController.getSingleProduct);

// POST a new product
router.post('/', isAuthenticated, productsController.createProduct);

// PUT to update a product by ID
router.put("/:id", isAuthenticated, productsController.updateProduct);

// DELETE a product by ID
router.delete("/:id", isAuthenticated, productsController.deleteProduct);

module.exports = router;