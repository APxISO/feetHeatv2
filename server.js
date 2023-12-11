const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const JWT = require('jsonwebtoken');
const { getUserById } = require('./db/users');
const { getCartByUserId, getAllProductsByOrderId } = require('./db/orders');

// Import routes
const apiRouter = require('./api'); // Assuming you have an 'api' directory for your routes

const app = express();
const port = process.env.PORT || 3000;

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
      const userDetails = await getUserById(user.id);
      if (!userDetails) {
        console.log("User not found with id:", user.id);
        return res.status(404).send({ error: "User not found" });
      }
      req.user = userDetails;

      // Fetch user's cart
      req.user.cart = await getCartByUserId(req.user.id);
      if (!req.user.cart) {
        console.log("Cart not found for user id:", req.user.id);
        req.user.cart = { products: [] }; // Assuming a default structure
      } else {
        // Fetch products for the cart
        req.user.cart.products = await getAllProductsByOrderId(req.user.cart.id);
      }

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
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
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
