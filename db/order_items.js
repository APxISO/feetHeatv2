const client = require("./index");

const addItemToOrder = async ({ orderId, productId, price, quantity }) => {
  // Validate parameters

  try {
    const { rows: [newItem] } = await client.query(
      `INSERT INTO order_items ("orderId", "productId", price, quantity) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [orderId, productId, price, quantity]
    );
    return newItem;
  } catch (error) {
    throw error;
  }
};

const removeSingleItem = async ({ orderId, productId }) => {
  // Validate parameters

  try {
    const { rows: [deletedItem] } = await client.query(
      `DELETE FROM order_items WHERE "orderId" = $1 AND "productId" = $2 RETURNING *;`,
      [orderId, productId]
    );
    return deletedItem;
  } catch (error) {
    throw error;
  }
};

const updateItemQuantity = async ({ orderId, productId, change }) => {
  // Validate parameters and 'change' should be either -1 or 1

  try {
    const { rows: [updatedItem] } = await client.query(
      `UPDATE order_items SET quantity = quantity + $1 WHERE "orderId" = $2 AND "productId" = $3 RETURNING *;`,
      [change, orderId, productId]
    );
    return updatedItem;
  } catch (error) {
    throw error;
  }
};

const getOrderPrice = async (orderId) => {
  // Validate orderId

  try {
    const { rows } = await client.query(
      `SELECT SUM(price) as total FROM order_items WHERE "orderId" = $1;`,
      [orderId]
    );
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

const getOrderByProductId = async (productId) => {
  // Validate productId

  try {
    const { rows: [order] } = await client.query(`SELECT * FROM order_items WHERE "productId" = $1;`, [productId]);
    return order;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addItemToOrder,
  removeSingleItem,
  updateItemQuantity,
  getOrderByProductId,
  getOrderPrice,
};
