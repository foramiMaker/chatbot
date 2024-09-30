const mongoose = require("mongoose");
const ordersSchema = new mongoose.Schema({
  _id: Number,
  product_id: {
    type: Number,

    required: true,
  },
  status: Number,
});

// Products schema
const productSchema = new mongoose.Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
  },
});

// Create models for each schema

const Orders = mongoose.model("Orders", ordersSchema); // 'Orders' collection
const Products = mongoose.model("Products", productSchema); // 'Products' collection

// Export the models
module.exports = { Orders, Products };
