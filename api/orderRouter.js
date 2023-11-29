const express = require("express");
const {
  getAllOrders,
  getOrderById,
  checkoutOrder,
  createOrder,
} = require("../db/orders");
const { getProductPrice } = require("../db/products");
const {
  addItemToOrder,
  removeSingleItem,
  updateItemQuantity,
  decreaseItemQuantity,
  getOrderPrice,
} = require("../db/order_items");

const orderRouter = express.Router();

orderRouter.get("/", async (req, res, next) => {
  try {
    const orders = await getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

orderRouter.get("/:id", async (req, res, next) => {
  try {
    const order = await getOrderById({ orderId: req.params.id });
    if (!order) {
      return res.status(404).send("Order not found");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/cart", async (req, res, next) => {
  try {
    const itemToAdd = await addItemToOrder(req.body);
    res.status(201).json(itemToAdd);
  } catch (error) {
    next(error);
  }
});

orderRouter.delete("/deleteItem/:orderId/:productId", async (req, res, next) => {
  try {
    const { orderId, productId } = req.params;
    const itemToDelete = await removeSingleItem({ orderId, productId });
    res.json(itemToDelete);
  } catch (error) {
    next(error);
  }
});

orderRouter.patch("/updateCartItem", async (req, res, next) => {
  try {
    const { orderId, productId, change } = req.body;
    const productPrice = await getProductPrice({ productId });
    const itemToUpdate = await updateItemQuantity({
      orderId,
      productId,
      change,
      productPrice,
    });
    res.json(itemToUpdate);
  } catch (error) {
    next(error);
  }
});

orderRouter.post("/orderPrice", async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const orderPrice = await getOrderPrice({ orderId });
    res.json({ orderPrice });
  } catch (error) {
    next(error);
  }
});

orderRouter.patch("/checkoutOrder/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const orderToCheckout = await checkoutOrder({ orderId });
    res.json(orderToCheckout);
  } catch (error) {
    next(error);
  }
});

module.exports = orderRouter;
