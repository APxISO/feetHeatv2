const express = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../db/categories");

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

categoriesRouter.post("/", async (req, res, next) => {
  try {
    const newCategory = await createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.patch("/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await updateCategory({ id: categoryId, name });
    if (!updatedCategory) {
      return res.status(404).send("Category not found");
    }
    res.json(updatedCategory);
  } catch (err) {
    next(err);
  }
});

categoriesRouter.delete("/:categoryId", async (req, res, next) => {
  const { categoryId } = req.params;
  
  try {
    const deletedCategory = await deleteCategory({ categoryId });
    if (!deletedCategory) {
      return res.status(404).send("Category not found");
    }
    res.json(deletedCategory);
  } catch (err) {
    next(err);
  }
});

module.exports = categoriesRouter;
