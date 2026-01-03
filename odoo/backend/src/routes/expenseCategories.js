const express = require("express");
const router = express.Router();
const { getExpenseCategories } = require("../controllers/expenseController");

router.get("/", getExpenseCategories);

module.exports = router;
