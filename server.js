require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

const transactionRoutes = require("./routes/transactionRoutes");

app.use(cors());
app.use(express.json());

// ✅ USE ROUTES (THIS YOU MISSED PROPERLY)
app.use("/api/transactions", transactionRoutes);

app.listen(7000, () => {
  console.log("Server running on port 7000 🚀");
});