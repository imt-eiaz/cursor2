// Update phone
router.put(
  "/:id",
  [
    body("brand").notEmpty().trim().escape(),
    body("model").notEmpty().trim().escape(),
    body("color").optional().trim().escape(),
    body("imei").notEmpty().trim().escape(),
    body("price").optional().isDecimal(),
    body("status").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      let { brand, model, color, imei, price, status } = req.body;

      // Fetch current phone
      const current = await db.query("SELECT * FROM phones WHERE id = $1", [
        id,
      ]);
      if (current.rows.length === 0) {
        return res.status(404).json({ error: "Phone not found" });
      }
      // Prevent IMEI change
      imei = current.rows[0].imei;

      // Check for duplicate IMEI (should never happen, but for safety)
      const imeiExists = await db.query(
        "SELECT id FROM phones WHERE imei = $1 AND id != $2",
        [imei, id]
      );
      if (imeiExists.rows.length > 0) {
        return res.status(400).json({ error: "IMEI already exists" });
      }

      const result = await db.query(
        `UPDATE phones SET brand = $1, model = $2, color = $3, imei = $4, price = $5, status = $6 WHERE id = $7 RETURNING *`,
        [brand, model, color, imei, price, status, id]
      );

      res.json({
        message: "Phone updated successfully",
        phone: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating phone:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Delete phone
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM phones WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Phone not found" });
    }
    res.json({ message: "Phone deleted successfully" });
  } catch (error) {
    console.error("Error deleting phone:", error);
    res.status(500).json({ error: "Server error" });
  }
});
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

// Create new phone
router.post(
  "/",
  [
    body("brand").notEmpty().trim().escape(),
    body("model").notEmpty().trim().escape(),
    body("color").optional().trim().escape(),
    body("imei").notEmpty().trim().escape(),
    body("price").optional().isDecimal(),
    body("status").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { brand, model, color, imei, price, status } = req.body;

      // Check for duplicate IMEI
      const imeiExists = await db.query(
        "SELECT id FROM phones WHERE imei = $1",
        [imei]
      );
      if (imeiExists.rows.length > 0) {
        return res.status(400).json({ error: "IMEI already exists" });
      }

      const result = await db.query(
        `INSERT INTO phones (brand, model, color, imei, price, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [brand, model, color, imei, price, status]
      );

      res.status(201).json({
        message: "Phone created successfully",
        phone: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating phone:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
