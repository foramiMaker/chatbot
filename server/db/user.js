const mongoose = require("mongoose");
const validator = require("validator");
const userdetailSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    maxlength: 8,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Already Exists"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  password: { type: String, require: true, minlength: 10 },
  isStatus: {
    type: Boolean,
    default: false, // false for offline, true for online
  },
});

module.exports = mongoose.model("userdetail", userdetailSchema);
