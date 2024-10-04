const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  prise: {
    type: String,
    require: true,
  },
  category: { type: String },
  // userId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId },
  company: { type: String },
});

module.exports = mongoose.model("product", ProductSchema);
