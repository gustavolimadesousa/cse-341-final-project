const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAllProducts); 

// GET a single product by ID
router.get('/:id', productsController.getSingleProduct);

// POST a new product
router.post('/', productsController.createProduct);

// PUT to update a product by ID
router.put('/:id', productsController.updateProduct);

// DELETE a product by ID
router.delete('/:id', productsController.deleteProduct);

module.exports = router;