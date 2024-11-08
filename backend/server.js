require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    // Test route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to the API!" });
    });

    //Products routes
    app.use("/products", routes.products);

    app.use("/inventory", routes.inventory);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
