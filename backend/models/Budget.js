const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  userId: String,
  month: String, // "2026-04"
  budget: Number
});

module.exports = mongoose.model("Budget", BudgetSchema);