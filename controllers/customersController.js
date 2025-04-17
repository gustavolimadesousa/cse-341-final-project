const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Get all customers
const getAllCustomers = async (req, res) => {
  //#swagger.tags = ['Customers']
  try {
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("customers")
      .find();
    results.toArray().then((customers) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(customers);
    });
  } catch (error) {
    console.error("Error retrieving customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single customer by ID
const getSingleCustomer = async (req, res) => {
  //#swagger.tags = ['Customers']
  try {
    const customerId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("customers")
      .find({ _id: customerId });
    result.toArray().then((customer) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(customer[0]);
    });
  } catch (error) {
    console.error("Error retrieving customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new customer
const createCustomer = async (req, res) => {
  //#swagger.tags = ['Customers']
  const { name, email, address } = req.body;

  try {
    const newCustomer = {
      name,
      email,
      address,
      createdAt: new Date(),
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("customers")
      .insertOne(newCustomer);

    if (result.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          result.error || "Some error occurred while creating the customer"
        );
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a customer by ID
const updateCustomer = async (req, res) => {
  //#swagger.tags = ['Customers']
  const customerId = req.params.id;
  const { name, email, address } = req.body;

  try {
    const db = mongodb.getDatabase().db();
    const customersCollection = db.collection("customers");

    const existingCustomer = await customersCollection.findOne({
      _id: new ObjectId(customerId),
    });

    if (!existingCustomer) {
      return res
        .status(404)
        .json({ message: `Customer not found: ${customerId}` });
    }

    const updateDoc = {
      $set: {
        name,
        email,
        address,
        updatedAt: new Date(),
      },
    };

    const result = await customersCollection.updateOne(
      { _id: new ObjectId(customerId) },
      updateDoc
    );

    if (result.modifiedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to update the customer" });
    }
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a customer by ID
const deleteCustomer = async (req, res) => {
  //#swagger.tags = ['Customers']
  const customerId = req.params.id;

  try {
    const db = mongodb.getDatabase().db();
    const customersCollection = db.collection("customers");

    const existingCustomer = await customersCollection.findOne({
      _id: new ObjectId(customerId),
    });

    if (!existingCustomer) {
      return res
        .status(404)
        .json({ message: `Customer not found: ${customerId}` });
    }

    const result = await customersCollection.deleteOne({
      _id: new ObjectId(customerId),
    });

    if (result.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to delete the customer" });
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCustomers,
  getSingleCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
