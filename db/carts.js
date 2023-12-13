const client = require("./index");

const createCartForUser = async (userId) => {
  try {
    // Ensure the 'carts' table structure is compatible with this query.
    // If the cart has more attributes (like status, items, total amount),
    // you may need to adjust this query to initialize these attributes.
    const { rows: [newCart] } = await client.query(`
      INSERT INTO carts ("userId") VALUES ($1) RETURNING *;
    `, [userId]);

    return newCart;
  } catch (error) {
    throw error;
  }
};

module.exports= {createCartForUser};