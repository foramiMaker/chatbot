const mongoose = require("mongoose");

const BookingScema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter user name"],
    },
    email: {
      type: String,
      required: true,
      default: 0,
    },
    mobile: {
      type: String,
      required: true,
      default: 0,
    },
    date: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    isSlot: {
      type: Boolean,
      default: false, // Default value is false
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", BookingScema);
module.exports = Booking;
