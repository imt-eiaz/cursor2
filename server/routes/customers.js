const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get customer by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM customers WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new customer
router.post(
  "/",
  [
    body("first_name").notEmpty().trim().escape(),
    body("last_name").optional().trim().escape(),
    body("phone").optional().trim().escape(),
    body("address").optional().trim().escape(),
    body("product").optional().trim().escape(),
    body("status").optional().trim().escape(),
    body("password").optional().trim().escape(),
    body("price").optional().trim().escape(),
    body("note").optional().trim().escape(),
    body("repair").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        first_name,
        last_name,
        phone,
        address,
        status,
        product,
        repair,
        password,
        price,
        note,
      } = req.body;

      const result = await db.query(
        "INSERT INTO customers (first_name, last_name, phone, address, status, product, repair, password, price, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          first_name,
          last_name,
          phone,
          address,
          status,
          product,
          repair,
          password,
          price,
          note,
        ]
      );

      res.status(201).json({
        message: "Customer created successfully",
        customer: result.rows[0],
      });
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Server erroraaaa" });
    }
  }
);

// Update customer
router.put(
  "/:id",
  [
    body("first_name").notEmpty().trim().escape(),
    body("last_name").optional().trim().escape(),
    body("phone").optional().trim().escape(),
    body("address").optional().trim().escape(),
    body("product").optional().trim().escape(),
    body("repair").optional().trim().escape(),
    body("password").optional().trim().escape(),
    body("price").optional().trim().escape(),
    body("note").optional().trim().escape(),
    body("status").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const {
        first_name,
        last_name,
        phone,
        address,
        product,
        repair,
        password,
        price,
        note,
        status,
      } = req.body;

      const result = await db.query(
        "UPDATE customers SET first_name = $1, last_name = $2, phone = $3, address = $4, status = $5, product = $6, repair = $7, password = $8, price = $9, note = $10 WHERE id = $11 RETURNING *",
        [
          first_name,
          last_name,
          phone,
          address,
          status,
          product,
          repair,
          password,
          price,
          note,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      res.json({
        message: "Customer updated successfully",
        customer: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Server errors" });
    }
  }
);

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json({
      message: "Customer deleted successfully",
      customer: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
