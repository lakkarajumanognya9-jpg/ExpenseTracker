const db = require("../config/db");

// GET
exports.getAll = (callback) => {
  db.query("SELECT * FROM transactions", (err, result) => {
    if (err) {
      console.log("GET ERROR:", err);
      return callback(err);
    }
    callback(null, result);
  });
};

// ADD
exports.add = (data, callback) => {
  console.log("MODEL ADD DATA:", data); // 🔥 DEBUG

  db.query(
    "INSERT INTO transactions (title, type, category, amount, date) VALUES (?, ?, ?, ?, ?)",
    [data.title, data.type, data.category, data.amount, data.date],
    (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err); // 🔥 DEBUG
        return callback(err);
      }

      console.log("INSERT SUCCESS"); // 🔥 DEBUG
      callback(null, result);
    }
  );
};

// DELETE
exports.delete = (id, callback) => {
  db.query("DELETE FROM transactions WHERE id = ?", [id], callback);
};
// UPDATE
exports.update = (id, data, callback) => {
  db.query(
    `UPDATE transactions
     SET title = ?, type = ?, category = ?, amount = ?, date = ?
     WHERE id = ?`,
    [data.title, data.type, data.category, data.amount, data.date, id],
    callback
  );
};