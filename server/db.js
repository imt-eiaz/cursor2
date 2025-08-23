const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "phone_repair_shop",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    // Customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        cost DECIMAL(10,2) NOT NULL,
        sku VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Inventory table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER DEFAULT 10,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sales table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sales (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
        item_id INTEGER REFERENCES items(id) ON DELETE SET NULL,
        quantity INTEGER NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payment_method VARCHAR(50),
        notes TEXT
      )
    `);

    // Users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Insert sample data
const insertSampleData = async () => {
  try {
    // Check if data already exists
    const customerCount = await pool.query("SELECT COUNT(*) FROM customers");
    if (parseInt(customerCount.rows[0].count) === 0) {
      // Insert sample customers
      await pool.query(`
        INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
        ('John', 'Doe', 'john@example.com', '555-0101', '123 Main St, City', 'to doo'),
        ('Jane', 'Smith', 'jane@example.com', '555-0102', '456 Oak Ave, Town', 'doingg')
      `);

      // Insert sample items
      await pool.query(`
        INSERT INTO items (name, description, category, price, cost, sku) VALUES
        ('iPhone Screen Replacement', 'High-quality iPhone screen replacement service', 'Repair', 89.99, 45.00, 'IPH-SCR-001'),
        ('Samsung Charging Port', 'Samsung phone charging port replacement', 'Repair', 49.99, 25.00, 'SAM-CHG-001'),
        ('Phone Case - iPhone 13', 'Durable protective case for iPhone 13', 'Accessories', 19.99, 8.00, 'CASE-IPH13-001'),
        ('Screen Protector - Universal', 'Tempered glass screen protector', 'Accessories', 9.99, 3.00, 'PROT-UNIV-001'),
        ('Battery Replacement Kit', 'Universal phone battery replacement kit', 'Parts', 29.99, 15.00, 'BAT-UNIV-001')
      `);

      // Insert sample inventory
      await pool.query(`
        INSERT INTO inventory (item_id, quantity, min_stock_level) VALUES
        (1, 5, 2),
        (2, 8, 3),
        (3, 25, 10),
        (4, 50, 20),
        (5, 15, 5)
      `);

      console.log("Sample data inserted successfully");
    }
  } catch (error) {
    console.error("Error inserting sample data:", error);
  }
};

// Initialize database
const initDatabase = async () => {
  await createTables();
  await insertSampleData();
};

initDatabase();

module.exports = pool;
