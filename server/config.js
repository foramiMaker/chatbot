const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ecomm").then(
    () => {
      console.log("server connected 5000");
    },
    (err) => {
      console.log("connection failed");
    }
  );