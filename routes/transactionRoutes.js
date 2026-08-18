const express = require("express");
const router = express.Router();

const controller = require("../controllers/transactionController");

// GET all transactions
router.get("/", controller.getTransactions);

// ADD new transaction
router.post("/", controller.addTransaction);

// DELETE transaction
router.delete("/:id", controller.deleteTransaction);

// UPDATE transaction
router.put("/:id", controller.updateTransaction);

module.exports = router;