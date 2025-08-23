const { Pool } = require("pg");
require("dotenv").config();

// First connect to default postgres database to create our database
const defaultPool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: "postgres", // Connect to default database first
  password: process.env.DB_PASSWORD || "asad",
  port: process.env.DB_PORT || 5432,
});

// Then connect to our specific database
const appPool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "phone_repair_shop",
  password: process.env.DB_PASSWORD || "asad",
  port: process.env.DB_PORT || 5432,
});

async function setupDatabase() {
  try {
    console.log("🚀 Setting up PhoneFix Pro database...");

    // Step 1: Create database if it doesn't exist
    console.log("📊 Creating database...");
    try {
      await defaultPool.query(
        `CREATE DATABASE ${process.env.DB_NAME || "phone_repair_shop"}`
      );
      console.log("✅ Database created successfully!");
    } catch (error) {
      if (error.code === "42P04") {
        console.log("ℹ️  Database already exists, continuing...");
      } else {
        throw error;
      }
    }

    await defaultPool.end();

    // Step 2: Create tables
    console.log("📋 Creating tables...");
    const client = await appPool.connect();

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table created");

    // Create customers table
    await client.query(`
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
    console.log("✅ Customers table created");

    // Create items table
    await client.query(`
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
    console.log("✅ Items table created");

    // Create inventory table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER DEFAULT 10,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Inventory table created");

    // Create sales table
    await client.query(`
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
    console.log("✅ Sales table created");

    // Step 3: Create indexes
    console.log("🔍 Creating indexes...");
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_items_category ON items(category)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_items_sku ON items(sku)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_inventory_item_id ON inventory(item_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_sales_item_id ON sales(item_id)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)"
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)"
    );
    console.log("✅ Indexes created");

    // Step 4: Insert sample data
    console.log("📝 Inserting sample data...");

    // Check if data already exists
    const userCount = await client.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCount.rows[0].count) === 0) {
      // Insert sample users
      await client.query(`
        INSERT INTO users (username, email, password_hash, role) VALUES
        ('admin', 'admin@phonefixpro.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
        ('staff1', 'staff1@phonefixpro.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff')
      `);
      console.log("✅ Sample users inserted");

      // Insert sample customers
      await client.query(`
        INSERT INTO customers (first_name, last_name, email, phone, address) VALUES
        ('John', 'Doe', 'john@example.com', '555-0101', '123 Main St, City', 'do do'),
        ('Jane', 'Smith', 'jane@example.com', '555-0102', '456 Oak Ave, Town', 'di di'),
        ('Mike', 'Johnson', 'mike@example.com', '555-0103', '789 Pine Rd, Village', 'da da'),
        ('Sarah', 'Williams', 'sarah@example.com', '555-0104', '321 Elm St, Borough', 'dd dd'),
        ('David', 'Brown', 'david@example.com', '555-0105', '654 Maple Dr, District', 'dang dang')
      `);
      console.log("✅ Sample customers inserted");

      // Insert sample items
      await client.query(`
        INSERT INTO items (name, description, category, price, cost, sku) VALUES
        ('iPhone Screen Replacement', 'High-quality iPhone screen replacement service with warranty', 'Repair', 89.99, 45.00, 'IPH-SCR-001'),
        ('Samsung Charging Port', 'Samsung phone charging port replacement and repair', 'Repair', 49.99, 25.00, 'SAM-CHG-001'),
        ('Phone Case - iPhone 13', 'Durable protective case for iPhone 13 with shock absorption', 'Accessories', 19.99, 8.00, 'CASE-IPH13-001'),
        ('Screen Protector - Universal', 'Tempered glass screen protector for all phone models', 'Accessories', 9.99, 3.00, 'PROT-UNIV-001'),
        ('Battery Replacement Kit', 'Universal phone battery replacement kit with tools', 'Parts', 29.99, 15.00, 'BAT-UNIV-001'),
        ('iPhone 12 Charger', 'Original Apple iPhone 12 charging cable and adapter', 'Accessories', 24.99, 12.00, 'CHG-IPH12-001'),
        ('Samsung Screen Repair', 'Professional Samsung screen repair service', 'Repair', 79.99, 40.00, 'SAM-SCR-001'),
        ('Phone Stand - Adjustable', 'Adjustable phone stand for desk and car use', 'Accessories', 14.99, 6.00, 'STAND-ADJ-001'),
        ('Microphone Replacement', 'Phone microphone replacement for various models', 'Parts', 19.99, 10.00, 'MIC-REP-001'),
        ('Water Damage Repair', 'Professional water damage assessment and repair service', 'Repair', 99.99, 50.00, 'WATER-REP-001')
      `);
      console.log("✅ Sample items inserted");

      // Insert sample inventory
      await client.query(`
        INSERT INTO inventory (item_id, quantity, min_stock_level) VALUES
        (1, 5, 2), (2, 8, 3), (3, 25, 10), (4, 50, 20), (5, 15, 5),
        (6, 30, 12), (7, 3, 2), (8, 40, 15), (9, 12, 5), (10, 2, 1)
      `);
      console.log("✅ Sample inventory inserted");

      // Insert sample sales
      await client.query(`
        INSERT INTO sales (customer_id, item_id, quantity, unit_price, total_amount, payment_method, notes) VALUES
        (1, 1, 1, 89.99, 89.99, 'Credit Card', 'Screen replacement for iPhone 12'),
        (2, 3, 2, 19.99, 39.98, 'Cash', 'Two phone cases'),
        (3, 4, 1, 9.99, 9.99, 'Debit Card', 'Screen protector'),
        (4, 2, 1, 49.99, 49.99, 'Credit Card', 'Charging port repair'),
        (5, 5, 1, 29.99, 29.99, 'Cash', 'Battery replacement kit')
      `);
      console.log("✅ Sample sales inserted");
    } else {
      console.log("ℹ️  Sample data already exists, skipping...");
    }

    client.release();
    await appPool.end();

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Database Summary:");
    console.log(`   Database: ${process.env.DB_NAME || "phone_repair_shop"}`);
    console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   User: ${process.env.DB_USER || "postgres"}`);
    console.log("\n🔑 Default Login Credentials:");
    console.log("   Username: admin or staff1");
    console.log("   Password: password");
    console.log("\n🚀 You can now start your application with: npm run dev");
  } catch (error) {
    console.error("❌ Database setup failed:");
    console.error("   Error:", error.message);

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure PostgreSQL is running on your system");
    } else if (error.code === "28P01") {
      console.log("\n💡 Check your database credentials in the .env file");
    }

    process.exit(1);
  }
}

setupDatabase();
