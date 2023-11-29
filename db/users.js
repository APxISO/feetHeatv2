const bcrypt = require("bcrypt");
const client = require("./index");

const createUser = async ({ username, password, isAdmin = false }) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const { rows: [newUser] } = await client.query(
      `INSERT INTO users (username, password, "isAdmin") VALUES ($1, $2, $3) RETURNING id, username, "isAdmin";`,
      [username, hashPassword, isAdmin]
    );

    return newUser;
  } catch (err) {
    if (err.code === "23505") {
      throw { name: "signupError", message: "Username is already taken" };
    } else {
      throw err;
    }
  }
};

const getUserById = async (userId) => {
  try {
    const { rows: [user] } = await client.query(
      `SELECT id, username, "isAdmin" FROM users WHERE id = $1`,
      [userId]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const getUser = async ({ username, password }) => {
  try {
    const { rows: [user] } = await client.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );

    if (!user) {
      throw { name: "loginError", message: "Incorrect username or password" };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      delete user.password;
      return user;
    } else {
      throw { name: "loginError", message: "Incorrect username or password" };
    }
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const { rows: [user] } = await client.query(`SELECT * FROM users WHERE username = $1`, [username]);
    return user;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const { rows: users } = await client.query(`SELECT id, username FROM users;`);
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getAllUsers,
};
