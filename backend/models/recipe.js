const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: URL },
  likes: { type: Number },
  missedIngredientCounts: { type: Number },
  missedIngredients: { type: String },
  usedIngredientCount: { type: Number },
  usedIngredients: { type: String },
});

module.exports = mongoose.model("Recipe", recipeSchema);
