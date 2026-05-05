const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ➕ ADD EXPENSE
router.post("/", async (req, res) => {
  const { amount, category, month } = req.body;

  const expense = new Expense({ amount, category, month });
  await expense.save();

  res.json("Added");
});

// 📥 GET MONTH DATA
router.get("/:month", async (req, res) => {
  const data = await Expense.find({ month: req.params.month });
  res.json(data);
});

// 📊 GET ALL DATA (for graph)
router.get("/", async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

// ❌ RESET MONTH
router.delete("/:month", async (req, res) => {
  await Expense.deleteMany({ month: req.params.month });
  res.json("Deleted");
});

module.exports = router;