const User = require("../models/user");
const jwt = require("jsonwebtoken");

const validateToken = async (token) => {
  try {
    console.log("Token: ", token);
    const decoded = jwt.verify(token, secretKey);
    const user = await User.findById(decoded._id);

    if (!user) {
      return { valid: false, message: "User not found." };
    }

    return { valid: true, user };
  } catch (error) {
    return {
      valid: false,
      message: "Your session expired, please login again.",
    };
  }
};

module.exports = validateToken;
