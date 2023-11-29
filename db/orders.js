const client = require("./");

const getAllOrders = async () => {
  try {
    const { rows } = await client.query(`SELECT * FROM orders;`);
    return rows;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    const { rows: [order] } = await client.query(`SELECT * FROM orders WHERE id = $1;`, [orderId]);
    return order;
  } catch (error) {
    throw error;
  }
};

const updateOrder = async ({ id, creatorId }) => {
  if (typeof id !== "number") {
    throw new Error("Order ID is required and must be a number.");
  }

  try {
    if (creatorId) {
      await client.query(
        `UPDATE orders SET "creatorId" = $1 WHERE id = $2;`,
        [creatorId, id]
      );
    }

    const { rows: [updatedOrder] } = await client.query(`SELECT * FROM orders WHERE id = $1;`, [id]);
    return updatedOrder;
  } catch (err) {
    throw err;
  }
};

const deleteOrder = async (orderId) => {
  try {
    const { rows: [deletedOrder] } = await client.query(`DELETE FROM orders WHERE id = $1 RETURNING *;`, [orderId]);
    return deletedOrder;
  } catch (err) {
    throw err;
  }
};

const createOrder = async ({ creatorId }) => {
  try {
    const { rows: [newOrder] } = await client.query(`INSERT INTO orders ("creatorId") VALUES ($1) RETURNING *;`, [creatorId]);
    return newOrder;
  } catch (error) {
    throw error;
  }
};

const checkoutOrder = async (orderId) => {
  try {
    const { rows: [checkedOutOrder] } = await client.query(`UPDATE orders SET "isPurchased" = true WHERE id = $1 RETURNING *;`, [orderId]);
    return checkedOutOrder;
  } catch (error) {
    throw error;
  }
};

const getCartByUserId = async (creatorId) => {
  try {
    const { rows: [cart] } = await client.query(`SELECT * FROM orders WHERE "creatorId" = $1 AND "isPurchased" = false;`, [creatorId]);
    return cart;
  } catch (error) {
    throw error;
  }
};

const getAllProductsByOrderId = async (orderId) => {
  try {
    const { rows: products } = await client.query(
      `SELECT products.id, products.title, order_items.price, products.imgurl, order_items.id as "order_items_id", order_items.quantity
       FROM order_items
       JOIN products ON products.id = order_items."productId"
       WHERE "orderId" = $1;`,
      [orderId]
    );
    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  deleteOrder,
  updateOrder,
  createOrder,
  checkoutOrder,
  getCartByUserId,
  getAllProductsByOrderId,
};
