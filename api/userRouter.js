const express = require("express");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");

const {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
  updateUserById,
  deleteUserById
} = require("../db/users");

const { createOrder } = require("../db/orders");

userRouter.use((req, res, next) => {
  console.log("A request is being made to /users...");
  next();
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Auth header received:", authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    console.log("Token verified, user ID:", user.id);
    next();
  });
}

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
    if (!user) {
      return res.status(401).send({ message: "Incorrect username or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    res.send({ user: { username: user.username, id: user.id }, token });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", authenticateToken, async (req, res, next) => {
  console.log("Token received in /me route:", req.headers.authorization);
  if (!req.user || !req.user.id) {
    console.log("req.user or req.user.id is undefined");
    return res.status(401).send({ error: "Invalid token or user not found" });
  }
  try {
    console.log("Fetching user details for ID:", req.user.id);
    const userDetails = await getUserById(req.user.id);
    if (!userDetails) {
      console.log("User not found for ID:", req.user.id);
      return res.status(404).send({ error: "User not found" });
    }

    console.log("User details found:", userDetails);
    res.send(userDetails);
  } catch (error) {
    console.error("Error in /me route:", error);
    next(error);
  }
});

userRouter.get("/username/:username", async (req, res, next) => {
  try {
    const { username } = req.params; // Extract username from the URL parameters
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    next(error);
  }
});

userRouter.patch("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params; // Extract userId from the URL parameters
    const updateData = req.body; // Extract the data to be updated from the request body

    // Call the updateUserById function with userId and updateData
    const updatedUser = await updateUserById(userId, updateData);

    if (!updatedUser) {
      return res.status(404).send({ error: "User not found or no update was made" });
    }

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params; // Extract userId from the URL parameters

    // Call the deleteUserById function with userId
    const deletedUser = await deleteUserById(userId);

    if (!deletedUser) {
      return res.status(404).send({ error: "User not found" });
    }

    res.status(200).send({ message: "User successfully deleted", deletedUser });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
    try {
      const users = await getAllUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
  });

module.exports = userRouter;
