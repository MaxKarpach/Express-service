const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'service',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5433,
})

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
})

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}