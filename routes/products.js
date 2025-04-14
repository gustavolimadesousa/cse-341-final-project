const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAllProducts); 

// GET a single product by ID
router.get('/:id', productsController.getSingleProduct);

module.exports = router;