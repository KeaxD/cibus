const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  inventories: [
    {
      inventory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
      },
    },
  ],
  mainInventory: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory" },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
