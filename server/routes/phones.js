const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db");

const router = express.Router();

// Get all inventory with item details
router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, pho.quantity, pho.min_stock_level, pho.last_updated,
             CASE 
               WHEN pho.quantity <= pho.min_stock_level THEN 'Low Stock'
               WHEN pho.quantity = 0 THEN 'Out of Stock'
               ELSE 'In Stock'
             END as stock_status
      FROM inventory pho
      JOIN items i ON pho.item_id = i.id
      ORDER BY i.name
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get low stock items
router.get("/low-stock", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, inv.quantity, inv.min_stock_level, inv.last_updated
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE inv.quantity <= inv.min_stock_level
      ORDER BY inv.quantity ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching low stock items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get inventory by item ID
router.get("/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT i.*, inv.quantity, inv.min_stock_level, inv.last_updated
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE i.id = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update inventory quantity
router.put(
  "/:id",
  [
    body("quantity").isInt({ min: 0 }),
    body("min_stock_level").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { quantity, min_stock_level } = req.body;

      // Check if inventory record exists
      const inventoryExists = await db.query(
        "SELECT * FROM inventory WHERE item_id = $1",
        [id]
      );

      if (inventoryExists.rows.length === 0) {
        return res.status(404).json({ error: "Inventory record not found" });
      }

      // Update inventory
      const updateFields = ["quantity = $1"];
      const updateValues = [quantity];
      let paramCount = 2;

      if (min_stock_level !== undefined) {
        updateFields.push(`min_stock_level = $${paramCount}`);
        updateValues.push(min_stock_level);
        paramCount++;
      }

      updateFields.push("last_updated = CURRENT_TIMESTAMP");
      updateValues.push(id);

      const result = await db.query(
        `UPDATE inventory SET ${updateFields.join(
          ", "
        )} WHERE item_id = $${paramCount} RETURNING *`,
        updateValues
      );

      res.json({
        message: "Inventory updated successfully",
        inventory: result.rows[0],
      });
    } catch (error) {
      console.error("Error updating inventory:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Add stock to inventory
router.post(
  "/:id/add-stock",
  [
    body("quantity").isInt({ min: 1 }),
    body("notes").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { quantity, notes } = req.body;

      // Check if inventory record exists
      const inventoryExists = await db.query(
        "SELECT * FROM inventory WHERE item_id = $1",
        [id]
      );

      if (inventoryExists.rows.length === 0) {
        return res.status(404).json({ error: "Inventory record not found" });
      }

      // Update inventory quantity
      const result = await db.query(
        "UPDATE inventory SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2 RETURNING *",
        [quantity, id]
      );

      // Log stock addition (you could create a separate stock_movements table for this)
      console.log(
        `Stock added: Item ID ${id}, Quantity: ${quantity}, Notes: ${
          notes || "No notes"
        }`
      );

      res.json({
        message: "Stock added successfully",
        inventory: result.rows[0],
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Remove stock from inventory
router.post(
  "/:id/remove-stock",
  [
    body("quantity").isInt({ min: 1 }),
    body("reason").notEmpty().trim().escape(),
    body("notes").optional().trim().escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { quantity, reason, notes } = req.body;

      // Check if inventory record exists and has sufficient stock
      const inventory = await db.query(
        "SELECT * FROM inventory WHERE item_id = $1",
        [id]
      );

      if (inventory.rows.length === 0) {
        return res.status(404).json({ error: "Inventory record not found" });
      }

      if (inventory.rows[0].quantity < quantity) {
        return res.status(400).json({ error: "Insufficient stock to remove" });
      }

      // Update inventory quantity
      const result = await db.query(
        "UPDATE inventory SET quantity = quantity - $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2 RETURNING *",
        [quantity, id]
      );

      // Log stock removal
      console.log(
        `Stock removed: Item ID ${id}, Quantity: ${quantity}, Reason: ${reason}, Notes: ${
          notes || "No notes"
        }`
      );

      res.json({
        message: "Stock removed successfully",
        inventory: result.rows[0],
      });
    } catch (error) {
      console.error("Error removing stock:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get inventory summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await db.query(`
      SELECT 
        COUNT(*) as total_items,
        SUM(inv.quantity) as total_stock,
        COUNT(CASE WHEN inv.quantity = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN inv.quantity <= inv.min_stock_level AND inv.quantity > 0 THEN 1 END) as low_stock,
        COUNT(CASE WHEN inv.quantity > inv.min_stock_level THEN 1 END) as in_stock
      FROM inventory inv
    `);

    const lowStockItems = await db.query(`
      SELECT i.name, inv.quantity, inv.min_stock_level
      FROM inventory inv
      JOIN items i ON inv.item_id = i.id
      WHERE inv.quantity <= inv.min_stock_level
      ORDER BY inv.quantity ASC
      LIMIT 5
    `);

    res.json({
      summary: summary.rows[0],
      lowStockItems: lowStockItems.rows,
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
