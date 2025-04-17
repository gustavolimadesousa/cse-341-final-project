const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

// Get all reviews
const getAllReviews = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const results = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .find();
    results.toArray().then((reviews) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(reviews);
    });
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single review by ID
const getSingleReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .find({ _id: reviewId });
    result.toArray().then((review) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(review[0]);
    });
  } catch (error) {
    console.error("Error retrieving review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new review
const createReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  const { productId, customerId, rating, comment } = req.body;

  try {
    const newReview = {
      productId: new ObjectId(productId),
      customerId: new ObjectId(customerId),
      rating,
      comment,
      date: new Date(),
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .insertOne(newReview);

    if (result.acknowledged) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(result.error || "Some error occurred while creating the review");
    }
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a review by ID
const updateReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  const reviewId = req.params.id;
  const { productId, customerId, rating, comment } = req.body;

  try {
    const updateDoc = {
      $set: {
        productId: new ObjectId(productId),
        customerId: new ObjectId(customerId),
        rating,
        comment,
        date: new Date(),
      },
    };

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .updateOne({ _id: new ObjectId(reviewId) }, updateDoc);

    if (result.modifiedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to update the review" });
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a review by ID
const deleteReview = async (req, res) => {
  //#swagger.tags = ['Reviews']
  const reviewId = req.params.id;

  try {
    const existingReview = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .findOne({ _id: new ObjectId(reviewId) });

    if (!existingReview) {
      return res.status(404).json({ message: `Review not found: ${reviewId}` });
    }

    const result = await mongodb
      .getDatabase()
      .db()
      .collection("reviews")
      .deleteOne({ _id: new ObjectId(reviewId) });

    if (result.deletedCount === 1) {
      res.status(204).send();
    } else {
      res.status(500).json({ message: "Failed to delete the review" });
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};
