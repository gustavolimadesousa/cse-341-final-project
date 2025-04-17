const express = require('express');
const router = express.Router();

const customersController = require('../controllers/customersController');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', customersController.getAllCustomers); 

router.get('/:id', customersController.getSingleCustomer);

router.post("/", isAuthenticated, customersController.createCustomer);

router.put('/:id', isAuthenticated, customersController.updateCustomer);

router.delete("/:id", isAuthenticated, customersController.deleteCustomer);

module.exports = router;

