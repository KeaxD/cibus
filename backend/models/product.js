const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  barcode: { type: String, required: true, unique: true },
  brands: { type: String },
  ingredients: { type: [String] },
  nutriments: {
    energy: Number,
    fat: Number,
    carbohydrates: Number,
    sugars: Number,
    proteins: Number,
    salt: Number,
  },
});

module.exports = mongoose.model("Product", productSchema);
