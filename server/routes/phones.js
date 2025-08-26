const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM phones");
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Error fetching phones:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
