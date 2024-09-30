// const express = require("express");
// const app = express();
// const http = require("http");
// const socketIo = require("socket.io");
// const server = http.createServer(app);
// const UserDetail = require("./db/user");
// const Product = require("./db/product");
// const { Orders, Products } = require("./db/orders");
// require("./config");
// const cors = require("cors");
// const product = require("./db/product");
// const jwt = require("jsonwebtoken");
// const jwtkey = "ecomm";
// // PORT = process.env || 5000;
// app.use(express.json());
// app.use(cors());

// // Initialize Socket.IO server on the existing HTTP server
// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000", // Adjust this to your frontend's URL
//     methods: ["GET", "POST"],
//   },
// });

// // Socket.IO connection logic
// io.on("connection", (socket) => {
//   console.log(`Client connected ${socket.id}`);

//   // Listen for messages from the client
//   socket.on("message", (message) => {
//     console.log("Received query:", message);
//     socket.broadcast.emit("received query", message);
//   });

//   // Handle client disconnection
//   socket.on("disconnect", (reason) => {
//     console.log(`Client disconnected with reason: ${reason}`);
//   });
// });

// app.get("/", async (req, res) => {
//   // res.send("api run");
//   const data = await UserDetail.find({});
//   console.log(data);
//   res.send(data);
// });

// app.post("/create", async (req, res) => {
//   // res.send("api run");
//   try {
//     let data = await UserDetail.create(req.body);
//     console.log(data);
//     data = data.toObject();
//     delete data.password;
//     const token = jwt.sign({ data }, "jwtkey", {
//       expiresIn: "1h",
//     });

//     res.send({ data, token });
//   } catch (err) {
//     console.log(err.message);
//     if (err.name === "ValidationError" || err.password === "validationeroor") {
//       return res.status(400).json({ error: "enter correct emailid" });
//     }
//   }
// });

// app.post("/addProduct", authenticateToken, async (req, res) => {
//   try {
//     const response = await Product.create(req.body);
//     res.json(response);
//   } catch (err) {
//     console.log(err.message);
//   }
// });
// //get product list
// app.get("/fetchproduct", authenticateToken, async (req, res) => {
//   const product = await Product.find();
//   if (product.length > 0) {
//     res.json(product);
//   } else {
//     res.json({ response: "no data found" });
//   }
// });
// app.post("/login", async (req, res) => {
//   try {
//     if (req.body.password && req.body.email) {
//       const user = await UserDetail.findOne(req.body).select("-password");
//       if (user) {
//         const token = jwt.sign({ user }, "jwtkey", {
//           expiresIn: "1h",
//         });
//         res.json({ user, token });
//       } else {
//         res.status(404).json({ result: "no user found" });
//       }
//     } else {
//       res.status(404).json({ result: "no user found" });
//     }
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// //delete product
// app.delete("/Delete/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndDelete(id);
//   console.log("delete data");
//   return res.json({ product: "delete" });
// });

// //get single product
// app.get("/product/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findOne({ _id: id });
//   if (product) {
//     res.json(product);
//   } else {
//     res.json({ response: "no product found" });
//   }
// });

// //update product
// app.put("/product/:id", authenticateToken, async (req, res) => {
//   const { id } = req.params;
//   const product = await Product.findByIdAndUpdate(id, req.body);
//   return res.json({ product });
// });

// //search product
// app.get("/search/:key", authenticateToken, async (req, res) => {
//   const product = await Product.find({
//     $or: [
//       { name: { $regex: req.params.key } },
//       { prise: { $regex: req.params.key } },
//       { category: { $regex: req.params.key } },
//       { company: { $regex: req.params.key } },
//     ],
//   });
//   return res.json({ product });
// });

// app.get("/orderdetails", async (req, res) => {
//   try {
//     const orderDetails = await Orders.aggregate([
//       {
//         $lookup: {
//           from: "products", // Collection name (must be plural)
//           localField: "product_id", // Field in Orders collection
//           foreignField: "id", // Field in Products collection
//           as: "product_details", // Output array field
//         },
//       },
//       {
//         $unwind: "$product_details", // Unwind the product details array
//       },
//     ]);

//     // Check if any order details were found
//     if (orderDetails) {
//       res.json(orderDetails);
//     } else {
//       res.status(404).json({ message: "No order details found" });
//     }
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// function authenticateToken(req, res, next) {
//   const token = req.headers["authorization"];
//   if (token) {
//     console.log("middleware", [token]); // Log the token in array format

//     // Verify the token using jwt
//     jwt.verify(token, jwtkey, () => {
//       // Token is valid, proceed to the next middleware
//       // req.user = user;
//       next();
//     });
//   } else {
//     return res.status(403).json({ error: "Token not provided" });
//   }
// }

// server.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });
require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const UserDetail = require("./db/user");
const Product = require("./db/product");
const { Orders, Products } = require("./db/orders");
require("./config");
const cors = require("cors");
const product = require("./db/product");
const jwt = require("jsonwebtoken");
const jwtkey = "ecomm";
// PORT = process.env || 5000;
app.use(express.json());
app.use(cors());

// dotenv.config();

// Initialize Socket.IO server on the existing HTTP server
// Initialize Socket.IO server on the existing HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST"],
  },
});
// Middleware to authenticate token for Socket.IO connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (validateToken(token)) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      socket.user = decoded.user; // Attach user data to the socket object
      next();
    });
  } else {
    next(new Error("Authentication error: Invalid token"));
  }
});
// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.email}`); // Now you have access to user data
  // Send the username to the connected client
  socket.emit("userDetails", {
    username: socket.user.name || socket.user.email,
  });
  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log("Received query:", message);
    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit("received query", {
      text: message,
      username: socket.user.name || socket.user.email,
    });
  });

  // Handle client disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected with reason: ${reason}`);
  });
});

// Function to validate the JWT token
function validateToken(token) {
  try {
    console.log(process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("Invalid Token:", error.message);
    return false;
  }
}

app.get("/", async (req, res) => {
  // res.send("api run");
  const data = await UserDetail.find({});
  console.log(data);
  res.send(data);
});

app.post("/create", async (req, res) => {
  // res.send("api run");
  try {
    let data = await UserDetail.create(req.body);
    console.log(data);
    data = data.toObject();
    delete data.password;
    const token = jwt.sign({ data }, "jwtkey", {
      expiresIn: "1h",
    });

    res.send({ data, token });
  } catch (err) {
    console.log(err.message);
    if (err.name === "ValidationError" || err.password === "validationeroor") {
      return res.status(400).json({ error: "enter correct emailid" });
    }
  }
});

app.post("/addProduct", authenticateToken, async (req, res) => {
  try {
    const response = await Product.create(req.body);
    res.json(response);
  } catch (err) {
    console.log(err.message);
  }
});
//get product list
app.get("/fetchproduct", authenticateToken, async (req, res) => {
  const product = await Product.find();
  if (product.length > 0) {
    res.json(product);
  } else {
    res.json({ response: "no data found" });
  }
});
app.post("/login", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      const user = await UserDetail.findOne(req.body).select("-password");
      if (user) {
        const token = jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h",
        });
        res.json({ user, token });
      } else {
        res.status(404).json({ result: "no user found" });
      }
    } else {
      res.status(404).json({ result: "no user found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//delete product
app.delete("/Delete/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  console.log("delete data");
  return res.json({ product: "delete" });
});

//get single product
app.get("/product/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOne({ _id: id });
  if (product) {
    res.json(product);
  } else {
    res.json({ response: "no product found" });
  }
});

//update product
app.put("/product/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);
  return res.json({ product });
});

//search product
app.get("/search/:key", authenticateToken, async (req, res) => {
  const product = await Product.find({
    $or: [
      { name: { $regex: req.params.key } },
      { prise: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  return res.json({ product });
});

app.get("/orderdetails", async (req, res) => {
  try {
    const orderDetails = await Orders.aggregate([
      {
        $lookup: {
          from: "products", // Collection name (must be plural)
          localField: "product_id", // Field in Orders collection
          foreignField: "id", // Field in Products collection
          as: "product_details", // Output array field
        },
      },
      {
        $unwind: "$product_details", // Unwind the product details array
      },
    ]);

    // Check if any order details were found
    if (orderDetails) {
      res.json(orderDetails);
    } else {
      res.status(404).json({ message: "No order details found" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    console.log("middleware", [token]); // Log the token in array format

    // Verify the token using jwt
    jwt.verify(token, jwtkey, () => {
      // Token is valid, proceed to the next middleware
      // req.user = user;
      next();
    });
  } else {
    return res.status(403).json({ error: "Token not provided" });
  }
}

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
