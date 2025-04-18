const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const testConnection = async () =>{
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySql DB Connected!');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySql DB 연결실패:', error);
    return false;
  }
}

testConnection();

module.exports = {pool};