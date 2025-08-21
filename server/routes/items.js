const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM items ORDER BY category, name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const result = await db.query(
      'SELECT * FROM items WHERE category = $1 ORDER BY name',
      [category]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching items by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM items WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new item
router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('description').optional().trim().escape(),
  body('category').notEmpty().trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('cost').isFloat({ min: 0 }),
  body('sku').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, price, cost, sku } = req.body;

    // Check if SKU already exists
    if (sku) {
      const skuExists = await db.query(
        'SELECT id FROM items WHERE sku = $1',
        [sku]
      );

      if (skuExists.rows.length > 0) {
        return res.status(400).json({ error: 'SKU already exists' });
      }
    }

    const result = await db.query(
      'INSERT INTO items (name, description, category, price, cost, sku) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, description, category, price, cost, sku]
    );

    // Create inventory record
    await db.query(
      'INSERT INTO inventory (item_id, quantity, min_stock_level) VALUES ($1, 0, 10)',
      [result.rows[0].id]
    );

    res.status(201).json({
      message: 'Item created successfully',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update item
router.put('/:id', [
  body('name').notEmpty().trim().escape(),
  body('description').optional().trim().escape(),
  body('category').notEmpty().trim().escape(),
  body('price').isFloat({ min: 0 }),
  body('cost').isFloat({ min: 0 }),
  body('sku').optional().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, description, category, price, cost, sku } = req.body;

    // Check if SKU exists for other items
    if (sku) {
      const skuExists = await db.query(
        'SELECT id FROM items WHERE sku = $1 AND id != $2',
        [sku, id]
      );

      if (skuExists.rows.length > 0) {
        return res.status(400).json({ error: 'SKU already exists' });
      }
    }

    const result = await db.query(
      'UPDATE items SET name = $1, description = $2, category = $3, price = $4, cost = $5, sku = $6 WHERE id = $7 RETURNING *',
      [name, description, category, price, cost, sku, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      message: 'Item updated successfully',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({
      message: 'Item deleted successfully',
      item: result.rows[0]
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
