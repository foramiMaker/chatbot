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
  userId: { type: String },
  company: { type: String },
});

module.exports = mongoose.model("products", ProductSchema);
