const model = require("../models/transactionModel");

// GET
exports.getTransactions = (req, res) => {
  model.getAll((err, result) => {
    if (err) {
      console.log("GET ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
};

// ADD
exports.addTransaction = (req, res) => {
  console.log("CONTROLLER HIT");        // 🔥 DEBUG
  console.log("BODY:", req.body);       // 🔥 DEBUG

  model.add(req.body, (err, result) => {
    if (err) {
      console.log("ADD ERROR:", err);   // 🔥 DEBUG
      return res.status(500).json(err);
    }

    console.log("INSERT SUCCESS");      // 🔥 DEBUG
    res.json({ message: "Added" });
  });
};

// DELETE
exports.deleteTransaction = (req, res) => {
  const id = req.params.id;

  model.delete(id, (err, result) => {
    if (err) {
      console.log("DELETE ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({ message: "Deleted" });
  });
};

// UPDATE
exports.updateTransaction = (req, res) => {
  const id = req.params.id;

  model.update(id, req.body, (err, result) => {
    if (err) {
      console.log("UPDATE ERROR:", err);
      return res.status(500).json(err);
    }

    res.json({ message: "Updated" });
  });
};