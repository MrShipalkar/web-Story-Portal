const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // Bypass authentication for GET requests on /api/story
    // if (req.method === "GET" && req.originalUrl.startsWith("/api/story/")) {
    //   return next();  // Bypass authentication and proceed
    // }

    // console.log("Request Method:", req.method);
    // console.log("Request URL:", req.originalUrl);

    let token = req.header("auth-token");

    if (!token) {
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
      }
    }

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify the token and extract the payload
    let verified;
    try {
      verified = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log("Error verifying token:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Log the payload to verify if the id or _id is present
    // console.log("Token payload:", verified);

    const userId = verified._id || verified.id; // Use either _id or id

    if (!userId) {
      console.log("Token missing user ID");
      return res.status(401).json({ message: "Token missing user ID" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found with ID:", userId);
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object for further use in route handlers
    req.user = user;
    next();
  } catch (err) {
    console.error("Error in authentication middleware:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
