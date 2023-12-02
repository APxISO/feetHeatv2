const client = require("./index");

const getProducts = async () => {
  const { rows } = await client.query(`SELECT * FROM products;`);
  return rows;
};

const getProductPrice = async (productId) => {
  try {
    const { rows: [product] } = await client.query(
      `SELECT price FROM products WHERE id = $1;`,
      [productId]
    );
    return product ? product.price : null;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (productId) => {
  try {
    const { rows: [product] } = await client.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    );
    return product;
  } catch (error) {
    throw error;
  }
};

const createProduct = async ({ title, description, imgurl, stock, price, category }) => {
  

  try {
    const sql = `
      INSERT INTO products (title, description, imgurl, stock, price, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [title, description, imgurl, stock, price, category];

    const { rows: [product] } = await client.query(sql, params);
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async (productData) => {
  const { id, title, description, imgurl, stock, price } = productData;
  // Validate id

  const fields = { title, description, imgurl, stock, price };
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      updates.push(`"${key}" = $${updates.length + 1}`);
      values.push(value);
    }
  }

  if (values.length === 0) {
    throw new Error("No valid fields provided for update");
  }

  values.push(id);

  try {
    await client.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${values.length};`,
      values
    );

    const { rows: [updatedProduct] } = await client.query(
      `SELECT * FROM products WHERE id = $1;`,
      [id]
    );

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

const destroyProduct = async (productId) => {
  try {
    await client.query(`DELETE FROM products_categories WHERE "productId" = $1;`, [productId]);
    const { rows: [deletedProduct] } = await client.query(
      `DELETE FROM products WHERE id = $1 RETURNING *;`,
      [productId]
    );

    return deletedProduct;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  destroyProduct,
  getProductPrice,
};
