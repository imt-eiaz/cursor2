const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// Get all sales
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, 
             c.first_name, c.last_name, c.email,
             i.name as item_name, i.sku
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN items i ON s.item_id = i.id
      ORDER BY s.sale_date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get sales by date range
router.get('/date-range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const result = await db.query(`
      SELECT s.*, 
             c.first_name, c.last_name, c.email,
             i.name as item_name, i.sku
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN items i ON s.item_id = i.id
      WHERE s.sale_date >= $1 AND s.sale_date <= $2
      ORDER BY s.sale_date DESC
    `, [start_date, end_date]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sales by date range:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get sale by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT s.*, 
             c.first_name, c.last_name, c.email,
             i.name as item_name, i.sku
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.id
      LEFT JOIN items i ON s.item_id = i.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching sale:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new sale
router.post('/', [
  body('customer_id').optional().isInt(),
  body('item_id').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('unit_price').isFloat({ min: 0 }),
  body('payment_method').optional().trim().escape(),
  body('notes').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_id, item_id, quantity, unit_price, payment_method, notes } = req.body;
    const total_amount = quantity * unit_price;

    // Check if item exists and has sufficient stock
    const itemResult = await db.query(
      'SELECT * FROM items WHERE id = $1',
      [item_id]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    // Check inventory
    const inventoryResult = await db.query(
      'SELECT quantity FROM inventory WHERE item_id = $1',
      [item_id]
    );

    if (inventoryResult.rows.length === 0 || inventoryResult.rows[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Create sale
    const saleResult = await db.query(
      'INSERT INTO sales (customer_id, item_id, quantity, unit_price, total_amount, payment_method, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_id, item_id, quantity, unit_price, total_amount, payment_method, notes]
    );

    // Update inventory
    await db.query(
      'UPDATE inventory SET quantity = quantity - $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2',
      [quantity, item_id]
    );

    res.status(201).json({
      message: 'Sale created successfully',
      sale: saleResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update sale
router.put('/:id', [
  body('customer_id').optional().isInt(),
  body('item_id').isInt(),
  body('quantity').isInt({ min: 1 }),
  body('unit_price').isFloat({ min: 0 }),
  body('payment_method').optional().trim().escape(),
  body('notes').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { customer_id, item_id, quantity, unit_price, payment_method, notes } = req.body;
    const total_amount = quantity * unit_price;

    // Get current sale to calculate inventory adjustment
    const currentSale = await db.query(
      'SELECT item_id, quantity FROM sales WHERE id = $1',
      [id]
    );

    if (currentSale.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    const oldItemId = currentSale.rows[0].item_id;
    const oldQuantity = currentSale.rows[0].quantity;

    // Update sale
    const result = await db.query(
      'UPDATE sales SET customer_id = $1, item_id = $2, quantity = $3, unit_price = $4, total_amount = $5, payment_method = $6, notes = $7 WHERE id = $8 RETURNING *',
      [customer_id, item_id, quantity, unit_price, total_amount, payment_method, notes, id]
    );

    // Update inventory for old item
    if (oldItemId === item_id) {
      // Same item, adjust quantity difference
      const quantityDiff = oldQuantity - quantity;
      await db.query(
        'UPDATE inventory SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2',
        [quantityDiff, item_id]
      );
    } else {
      // Different item, restore old item inventory and reduce new item inventory
      await db.query(
        'UPDATE inventory SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2',
        [oldQuantity, oldItemId]
      );
      await db.query(
        'UPDATE inventory SET quantity = quantity - $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2',
        [quantity, item_id]
      );
    }

    res.json({
      message: 'Sale updated successfully',
      sale: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete sale
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get sale details for inventory restoration
    const sale = await db.query(
      'SELECT item_id, quantity FROM sales WHERE id = $1',
      [id]
    );

    if (sale.rows.length === 0) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Restore inventory
    await db.query(
      'UPDATE inventory SET quantity = quantity + $1, last_updated = CURRENT_TIMESTAMP WHERE item_id = $2',
      [sale.rows[0].quantity, sale.rows[0].item_id]
    );

    // Delete sale
    const result = await db.query(
      'DELETE FROM sales WHERE id = $1 RETURNING *',
      [id]
    );

    res.json({
      message: 'Sale deleted successfully',
      sale: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting sale:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
