require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const UserDetail = require("./db/user");
const Product = require("./db/product");
// const { Orders, Products } = require("./db/orders");
const Booking = require("./db/booking.model");
require("./config");
const cors = require("cors");
const csv = require("csvtojson");
const CsvParser = require("json2csv").Parser;
const jwt = require("jsonwebtoken");
// const jwtkey = "ecomm";
const authenticateToken = require("./middleware/authenticateToken");
const multer = require("multer");
const path = require("path");
const axios = require("axios");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
// PORT = process.env || 5000;

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "public")));
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    allowedHeaders: ["Authorization", "Content-Type"], // Allow authorization header
  })
);

const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_ekV0HR5il0Avnp", // replace with your Razorpay key id
  key_secret: "rPPqnXyVxl8lMuBhkzSpGtQD", // replace with your Razorpay key secret
});

// Initialize Socket.IO server on the existing HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST"],
  },
});
// Middleware to authenticate token for Socket.IO connections
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (validateToken(token)) {
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//       if (err) {
//         return next(new Error("Authentication error: Invalid token"));
//       }
//       // socket.user = decoded.user; // Attach user data to the socket object
//       // next();
//       if (decoded && decoded.id) {
//         socket.user = decoded; // Assign the decoded user object
//         next();
//       } else {
//         next(new Error("Authentication error: User not found in token"));
//       }
//     });
//   } else {
//     next(new Error("Authentication error: Invalid token"));
//   }
// });

//update code for both side work proper
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error: Invalid token"));
      }
      // Handle both local and social authentication
      socket.user = decoded.user ? decoded.user : decoded; // Extract user from payload or assign decoded directly
      if (socket.user && socket.user.id) {
        next(); // User is authenticated
      } else {
        next(new Error("Authentication error: User not found in token"));
      }
    });
  } else {
    next(new Error("Authentication error: Token not provided"));
  }
});

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user.email}`); // Now you have access to user data
  // Send the username to the connected client
  // socket.emit("userDetails", {
  //   username: socket.user.name || socket.user.email,
  // });
  if (socket.user && socket.user.email) {
    console.log(`User connected: ${socket.user.email}`);
    socket.emit("userDetails", {
      username: socket.user.name || socket.user.email,
    });
  } else {
    console.error("User data is incomplete or missing.");
  }
  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log("Received query:", message);
    // Broadcast the message to all connected clients except the sender
    socket.broadcast.emit("received query", {
      text: message.text,
      username: message.username,
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

//getbookingbydate
app.get("/bookings", async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await Booking.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/bookingdetails", async (req, res) => {
  try {
    const detail = await Booking.find({});
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//for payment integration api
app.post("/createOrder", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (e.g., Rs 500 should be passed as 50000)
      currency,
      receipt: `receipt_${Math.floor(Math.random() * 1000000)}`, // Unique receipt id
    };

    const order = await instance.orders.create(options);
    res.status(200).json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/create", async (req, res) => {
  // res.send("api run");
  try {
    let data = await UserDetail.create(req.body);
    console.log(data);
    data = data.toObject();
    delete data.password;
    const token = jwt.sign({ data }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.send({ data, token });
  } catch (err) {
    console.log(err.message);
    // if (err.name === "ValidationError" || err.password === "validationeroor") {
    //   return res.status(400).json({ error: "enter correct emailid" });
    // }
  }
});

//booking slot
app.post("/booking", authenticateToken, async (req, res) => {
  try {
    let { name, email, mobile, date, slot, amount } = req.body;

    // Convert the date to YYYY-MM-DD format
    const parsedDate = new Date(date);
    const formattedDate = new Date(
      Date.UTC(
        parsedDate.getUTCFullYear(),
        parsedDate.getUTCMonth(),
        parsedDate.getUTCDate()
      )
    )
      .toISOString()
      .split("T")[0];

    // Check if the slot is already booked for the given date
    const existingBooking = await Booking.findOne({
      date: formattedDate,
      slot,
    });
    if (existingBooking) {
      return res.status(400).json({ message: "This slot is already booked" });
    }

    // Retrieve the authenticated user's ID from the JWT
    const userId = req.user._id || req.user.id;

    const booking = await Booking.create({
      name,
      email,
      mobile,
      date: formattedDate,
      slot,
      amount,
      isSlot: true,
      userId: userId, // Store the user ID in the booking
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
// get product list
app.get("/fetchproduct", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // Extract user ID from the token
    console.log("User ID from token:", userId);
    const product = await Product.find({ userId }); // Find products by logged-in user's ID
    console.log("Products found:", product); // Log found products
    if (product.length > 0) {
      res.json(product);
    } else {
      res.json({ response: "no data found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.post("/login", async (req, res) => {
  try {
    if (req.body.password && req.body.email) {
      const user = await UserDetail.findOne(req.body).select("-password");
      if (user) {
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1h",
          }
        );
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
  const userId = req.user._id || req.user.id;
  const product = await Product.find({
    userId,
    $or: [
      { name: { $regex: req.params.key } },
      { prise: { $regex: req.params.key } },
      { category: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
    ],
  });
  return res.json({ product });
});

//import product
app.post(
  "/import",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      const userId = req.user._id || req.user.id;
      const userData = [];
      csv()
        .fromFile(req.file.path)
        .then(async (response) => {
          for (let x = 0; x < response.length; x++) {
            userData.push({
              name: response[x].name,
              prise: response[x].prise,
              category: response[x].category,
              company: response[x].company,
              userId: userId,
            });
          }
          await Product.insertMany(userData);
        });
      res.send({ status: 200, success: true, msg: "Csv Imported" });
    } catch {}
  }
);

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

//download product list api
app.get("/export", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // Get the user ID from the token
    const products = [];
    const userData = await Product.find({ userId });

    userData.forEach((product) => {
      const { id, name, prise, category, company } = product;
      products.push({ id, name, prise, category, company });
    });
    const csvFields = ["id", "name", "prise", "category", "company"];
    const csvParser = new CsvParser({ fields: csvFields });
    const csvData = csvParser.parse(products);

    res.setHeader("content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment;filename=productsData.csv"
    );
    res.status(200).end(csvData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// function authenticateToken(req, res, next) {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   // const token = req.headers["authorization"];
//   if (token) {
//     console.log("middleware", [token]); // Log the token in array format

//     // Verify the token using jwt
//     jwt.verify(token, jwtkey, (err, decoded) => {
//       if (err) {
//         return res.status(401).json({ message: "Invalid or expired token" });
//       }
//       // Token is valid, proceed to the next middleware
//       req.user = decoded;
//       next();
//     });
//   } else {
//     return res.status(403).json({ error: "Token not provided" });
//   }
// }

//api for social authentication

app.get("/auth/google", (req, res) => {
  const redirect_uri = "http://localhost:5000/auth/google/callback"; // Your redirect URI
  const client_id = process.env.GOOGLE_CLIENT_ID; // Your Client ID
  const scope =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;

  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const redirect_uri = "http://localhost:5000/auth/google/callback"; // Your redirect URI

  const client_id = process.env.GOOGLE_CLIENT_ID; // Your Client ID
  const client_secret = process.env.GOOGLE_CLIENT_SECRET; // Your Client Secret

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        code,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      },
    });

    const { access_token } = response.data;

    // Fetch user info from Google
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userData = userInfoResponse.data;
    console.log(userData); // { id, email, name, etc. }

    // You can now create or find a user in your database and create a JWT token
    const user = await UserDetail.findOne({ email: userData.email });

    if (!user) {
      // Create a new user if not exists
      const newUser = await UserDetail.create({
        name: userData.name,
        email: userData.email,
        // You can also store other fields you need
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({ user: newUser, token });
    }

    // User found, create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    // res.json({ user, token });
    // Inside your /auth/google/callback route after creating the token
    res.redirect(
      `http://localhost:3000/GoogleRedirect?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );

    console.log(
      `Redirect URL: http://localhost:3000/GoogleRedirect?token=${token}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
    console.log("User before encoding:", user);
    console.log(
      "User after encoding:",
      encodeURIComponent(JSON.stringify(user))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
