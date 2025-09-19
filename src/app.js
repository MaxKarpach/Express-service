const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.get('/health', async (req, res) => {
  try {
    const db = require('./config/database');
    await db.query('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'Server and database are connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});