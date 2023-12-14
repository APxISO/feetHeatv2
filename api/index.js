const express = require("express");
const productRouter = require("./productRouter");
const userRouter = require("./userRouter");
const categoriesRouter = require("./categoriesRouter");
const orderRouter = require("./orderRouter");

// Create a new router for the API
const apiRouter = express.Router();

// Use the routers for different routes
apiRouter.use("/products", productRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/categories", categoriesRouter);

// Root route for the API
apiRouter.get("/", (req, res) => {
  res.send("api router working");
});

// Export the apiRouter
module.exports = apiRouter;