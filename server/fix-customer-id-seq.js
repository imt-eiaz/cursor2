// Script to fix customers_id_seq in PostgreSQL
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "phone_repair_shop",
  password: process.env.DB_PASSWORD || "asad",
  port: process.env.DB_PORT || 5432,
});

async function fixCustomerIdSequence() {
  try {
    const result = await pool.query(
      "SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));"
    );
    console.log("customers_id_seq has been fixed:", result.rows);
  } catch (err) {
    console.error("Error fixing customers_id_seq:", err);
  } finally {
    await pool.end();
  }
}

fixCustomerIdSequence();
