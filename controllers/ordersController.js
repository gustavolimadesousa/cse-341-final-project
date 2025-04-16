const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Function to get all orders from the database
// and send them as a JSON response

const getAllOrders = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("orders")
      .find();
    results.toArray().then((orders) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(orders);
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Function to get a single order by ID from the database
// and send it as a JSON response

const getSingleOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  try {
    const orderId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("orders")
      .find({ _id: orderId });
    result.toArray().then((order) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(order[0]);
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Function to create a new order in the database
// and send the created order as a JSON response


const createOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  const { customerName, items, status } = req.body;

  try {
    const db = mongodb.getDatabase().db();
    const productsCollection = db.collection("products");

    // Validate all products and calculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await productsCollection.findOne({
        _id: new ObjectId(item.productId),
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      total += product.price * quantity;

      validatedItems.push({
        productId: new ObjectId(item.productId),
        quantity,
      });
    }

    // Build the order
    const newOrder = {
      customerName,
      orderDate: new Date(),
      items: validatedItems,
      total,
      status: status || "Pending",
    };

    const result = await db.collection("orders").insertOne(newOrder);

    if (result.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(result.error || "Some error occurred while creating the order");
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update an existing order by ID in the database
// and send a success response
const updateOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  const { customerName, items, status } = req.body;
  const orderId = req.params.id;

  try {
    const db = mongodb.getDatabase().db();
    const ordersCollection = db.collection("orders");
    const productsCollection = db.collection("products");

    const existingOrder = await ordersCollection.findOne({
      _id: new ObjectId(orderId),
    });

    if (!existingOrder) {
      return res.status(404).json({ message: `Order not found: ${orderId}` });
    }

    // Validate items and recalculate total
    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await productsCollection.findOne({
        _id: new ObjectId(item.productId),
      });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      const quantity = item.quantity || 1;
      total += product.price * quantity;

      validatedItems.push({
        productId: new ObjectId(item.productId),
        quantity,
      });
    }

    const updateDoc = {
      $set: {
        customerName,
        items: validatedItems,
        total,
        status: status || existingOrder.status,
      },
    };

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(orderId) },
      updateDoc
    );

    if (result.modifiedCount === 1) {
      res.status(204).send(); // success, no content
    } else {
      res.status(500).json({ message: "Failed to update the order" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete an order by ID from the database
// and send a success response  

const deleteOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
  const orderId = req.params.id;

  try {
    const db = mongodb.getDatabase().db();
    const ordersCollection = db.collection("orders");

    const existingOrder = await ordersCollection.findOne({
      _id: new ObjectId(orderId),
    });

    if (!existingOrder) {
      return res.status(404).json({ message: `Order not found: ${orderId}` });
    }

    const result = await ordersCollection.deleteOne({
      _id: new ObjectId(orderId),
    });

    if (result.deletedCount === 1) {
      res.status(204).send(); // success, no content
    } else {
      res.status(500).json({ message: "Failed to delete the order" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {
  getAllOrders,
  getSingleOrder,
  createOrder,
  updateOrder,
  deleteOrder
};

