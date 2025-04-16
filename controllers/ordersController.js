const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Function to get all orders from the database
// and send them as a JSON response

const getAllOrders = async (req, res) => {
  //#swagger.tags = ['Orders']
  const results = await mongodb
    .getDatabase()
    .db()
    .collection("orders")
    .find();
  results.toArray().then((orders) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(orders);
  });
};


// Function to get a single order by ID from the database
// and send it as a JSON response

const getSingleOrder = async (req, res) => {
  //#swagger.tags = ['Orders']
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
};

module.exports = {
  getAllOrders,
  getSingleOrder,
};

