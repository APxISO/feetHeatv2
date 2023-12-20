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
    const orderId = parseInt(req.params.id);
    if (isNaN(orderId)) {
      return res.status(400).send("Invalid order ID");
    }

    const order = await getOrderById(orderId);
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
    // Assuming req.user.id contains the authenticated user's ID
    let userCart = await getCartByUserId(req.user.id);
    
    if (!userCart) {
      // If no active cart, create a new cart for the user
      userCart = await createOrder({ creatorId: req.user.id });
    }

    // Add the item to the user's cart
    const itemToAdd = await addItemToOrder({
      orderId: userCart.id,
      ...req.body
    });

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
    console.log("Request body:", req.body); 

    const orderId = parseInt(req.body.orderId, 10);
    const productId = parseInt(req.body.productId, 10);
    const change = req.body.change;

    if (isNaN(orderId) || isNaN(productId)) {
      return res.status(400).send("orderId and productId must be integers");
    }

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