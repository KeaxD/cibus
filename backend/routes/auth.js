const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    //Send the new user a token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2d",
    });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//Validate token Router
router.post("/validate", async (req, res) => {
  const { token } = req.body;
  console.log("Validating token: ", token);
  try {
    const validationResult = await validateToken(token);
    console.log("Result: ", validationResult);

    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message });
    }
    const newToken = jwt.sign(
      { userId: validationResult.user._id },
      JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );
    res.send({ newToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
