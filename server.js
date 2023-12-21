const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const { Pool } = require('pg'); // Import Pool
const JWT = require('jsonwebtoken');
const apiRouter = require('./api');

const app = express();
const port = process.env.PORT || 3000;

// Database configuration
const dbConfig = process.env.NODE_ENV === 'production' ? {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
} : {};

const db = new Pool(dbConfig);

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// JWT Authentication Middleware
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const user = JWT.verify(token, process.env.JWT_SECRET);

      // Fetch user details
      const userDetails = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
      if (!userDetails.rows[0]) {
        console.log("User not found with id:", user.id);
        return res.status(404).send({ error: "User not found" });
      }
      req.user = userDetails.rows[0];

      // Fetch user's cart
      const cart = await db.query('SELECT * FROM carts WHERE user_id = $1', [req.user.id]);
      req.user.cart = cart.rows[0] || { products: [] };

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ error: 'Invalid Token' });
      }
      console.error("Error in JWT Middleware:", error);
      next(error);
    }
  } else {
    next();
  }
});

// API Routes
app.use('/api', apiRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: err.message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app; 
