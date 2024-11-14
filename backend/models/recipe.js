const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  image: { type: String },
  likes: { type: Number },
  instructions: { type: String },
});

module.exports = mongoose.model("Recipe", recipeSchema);
