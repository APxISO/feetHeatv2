const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const {
  createUser,
  getUser,
  getUserByUsername,
  getAllUsers,
} = require("../db/users");

const { createOrder } = require("../db/orders");

userRouter.use((req, res, next) => {
  console.log("A request is being made to /users...");
  next();
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (password.length < 8) {
      return res.status(400).send("Password too short, must be at least 8 characters");
    }

    const user = await createUser(req.body);
    await createOrder({ creatorId: user.id });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    res.status(201).send({ user: { username: user.username, id: user.id }, token });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const user = await getUser(req.body);
    if (user.error) {
      return res.status(401).send(user.error);
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    res.send({ user: { username: user.username, id: user.id }, token });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", async (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: "No user logged in" });
  }
  res.send(req.user);
});

userRouter.get("/all", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
