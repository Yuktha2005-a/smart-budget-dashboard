const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  amount: Number,
  category: String,
  month: String // IMPORTANT: "2026-04"
});

module.exports = mongoose.model("Expense", ExpenseSchema);