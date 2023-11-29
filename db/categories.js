const client = require("./index");

const getAllCategories = async () => {
  try {
    const { rows } = await client.query(`SELECT * FROM categories;`);
    return rows;
  } catch (error) {
    throw error;
  }
};

const createCategory = async ({ name }) => {
  try {
    const { rows: [category] } = await client.query(
      `INSERT INTO categories(name) VALUES ($1) RETURNING *;`,
      [name]
    );
    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async ({ id, name }) => {
  if (typeof id !== "number" || !name) {
    throw new Error("Valid id and name are required.");
  }

  try {
    await client.query(
      `UPDATE categories SET name = $1 WHERE id = $2;`,
      [name, id]
    );

    const { rows: [updatedCategory] } = await client.query(`SELECT * FROM categories WHERE id = $1;`, [id]);
    return updatedCategory;
  } catch (err) {
    throw err;
  }
};

const deleteCategory = async (categoryId) => {
  try {
    await client.query(`DELETE FROM products_categories WHERE "categoryId" = $1;`, [categoryId]);
    const { rows: [deletedCategory] } = await client.query(`DELETE FROM categories WHERE id = $1 RETURNING *;`, [categoryId]);
    return deletedCategory;
  } catch (err) {
    throw err;
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const { rows: [category] } = await client.query(`SELECT * FROM categories WHERE id = $1;`, [categoryId]);
    return category;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
};
