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

productRouter.post("/", async (req, res) => {
  try {
    const product = await createProduct(req.body); 
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
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
  try {
    const { productId } = req.params;
    const deletedProduct = await destroyProduct(productId);
    res.status(200).json(deletedProduct);
  } catch (error) {
    next(error);
  }
});


productRouter.get("/:productId", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      return res.status(400).send({ error: "Invalid product ID" });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    res.send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = productRouter;
