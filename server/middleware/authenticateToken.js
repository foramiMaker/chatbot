const jwt = require("jsonwebtoken");
require("dotenv").config();

// function authenticateToken(req, res, next) {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   // const token = req.headers["authorization"];
//   if (token) {
//     console.log("middleware", [token]); // Log the token in array format

//     // Verify the token using jwt
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
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
const authenticateToken = (req, res, next) => {
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // req.user = verified.user; // Ensure this contains the correct _id
    // Check if the token contains a user object or is itself the user data
    req.user = verified.user ? verified.user : verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

module.exports = authenticateToken;
