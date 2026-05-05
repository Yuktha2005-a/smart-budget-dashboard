const express = require("express");
const router = express.Router();
const Budget = require("../models/Budget");
const jwt = require("jsonwebtoken");

// VERIFY
const verify = (req, res, next) => {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, "secretkey");
  req.userId = decoded.id;
  next();
};

// SAVE BUDGET
router.post("/", verify, async (req, res) => {
  const { month, budget } = req.body;

  await Budget.findOneAndUpdate(
    { userId: req.userId, month },
    { budget },
    { upsert: true }
  );

  res.json("Saved");
});

// GET BUDGET
router.get("/:month", verify, async (req, res) => {
  const data = await Budget.findOne({
    userId: req.userId,
    month: req.params.month
  });

  res.json(data || { budget: 0 });
});

module.exports = router;