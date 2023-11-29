const express = require("express");
const {
  getProducts,
  createProduct,
  updateProduct,
  destroyProduct,
  getProductById,
} = require("../db/products");

const productRouter = express.Router();

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productRouter.post("/", async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

productRouter.patch("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await updateProduct({ id: productId, ...updateData });
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  
  try {
    const deletedProduct = await destroyProduct({ productId });
    res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await getProductById({ productId: req.params.productId });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = productRouter;
