const client = require("./index");

const getProductsByCategory = async (categoryId) => {
  try {
    const { rows: products } = await client.query(
      `SELECT products.* FROM products 
       JOIN products_categories ON products.id = products_categories."productId"
       WHERE products_categories."categoryId" = $1;`,
      [categoryId]
    );
    return products;
  } catch (error) {
    throw error;
  }
};

const addProductToCategory = async ({ categoryId, productId }) => {
  try {
    const { rows: [productCategory] } = await client.query(
      `INSERT INTO products_categories ("categoryId", "productId")
       VALUES ($1, $2)
       ON CONFLICT ("categoryId", "productId") DO NOTHING
       RETURNING *;`,
      [categoryId, productId]
    );
    return productCategory || { message: "Product already in category or invalid IDs" };
  } catch (error) {
    throw error;
  }
};

const deleteProductFromCategory = async ({ categoryId, productId }) => {
  try {
    const { rows: [deletedProductCategory] } = await client.query(
      `DELETE FROM products_categories
       WHERE "categoryId" = $1 AND "productId" = $2
       RETURNING *;`,
      [categoryId, productId]
    );
    return deletedProductCategory || { message: "No such product-category relationship" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addProductToCategory,
  getProductsByCategory,
  deleteProductFromCategory,
};
