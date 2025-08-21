const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'phone_repair_shop',
  password: process.env.DB_PASSWORD || 'asad',
  port: process.env.DB_PORT || 5432,
});

async function testConnection() {
  try {
    console.log('🔌 Testing PostgreSQL connection...');
    console.log('📊 Connection details:');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'phone_repair_shop'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    
    // Test a simple query
    const result = await client.query('SELECT version()');
    console.log('📋 PostgreSQL version:', result.rows[0].version);
    
    // Test if our database exists and has tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('📋 Existing tables:');
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('📋 No tables found. Database is empty.');
    }
    
    client.release();
    await pool.end();
    
    console.log('✅ Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('   Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Make sure PostgreSQL is running');
      console.log('   2. Check if the port 5432 is correct');
      console.log('   3. Verify the host address');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('   1. Check your username and password');
      console.log('   2. Verify the user has access to the database');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   1. Create the database: CREATE DATABASE phone_repair_shop;');
      console.log('   2. Or check the database name in your .env file');
    }
    
    process.exit(1);
  }
}

testConnection();
