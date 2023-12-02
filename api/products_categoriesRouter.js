const express = require("express");
const {
  getProductsByCategory,
  addProductToCategory,
  deleteProductFromCategory,
} = require("../db/products_categories");
const { getAllCategories } = require("../db/categories");

const products_categoriesRouter = express.Router();

products_categoriesRouter.use((req, res, next) => {
  console.log("A request is being made to /products_categories");
  next();
});

// Get all categories
products_categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Add a product to a category
products_categoriesRouter.post("/", async (req, res, next) => {
  const { productId, categoryId } = req.body;
  try {
    const productCategory = await addProductToCategory({ productId, categoryId });
    res.json(productCategory);
  } catch (error) {
    next(error);
  }
});

// Delete a product from a category
products_categoriesRouter.delete("/", async (req, res, next) => {
  const { productId, categoryId } = req.body;
  try {
    const removedProductCategory = await deleteProductFromCategory({ productId, categoryId });
    res.json(removedProductCategory);
  } catch (error) {
    next(error);
  }
});

module.exports = products_categoriesRouter;
