const bcrypt = require("bcrypt");
const client = require("./index");

const createUser = async ({ username, password, isAdmin = false }) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error(`Username ${username} is already taken`);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const { rows: [newUser] } = await client.query(
      `INSERT INTO users (username, password, "isAdmin") VALUES ($1, $2, $3) RETURNING id, username, "isAdmin";`,
      [username, hashPassword, isAdmin]
    );

    return newUser;
  } catch (err) {
    throw new Error(`Error creating user: ${err.message}`);
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
    const { rows } = await client.query(`SELECT * FROM users WHERE username = $1`, [username]);
    if (rows.length) {
      return rows[0];
    } else {
      return null; // Return null if no user is found
    }
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

const updateUserById = async (userId, updateData) => {
  const { username, isAdmin } = updateData;

  try {
    // Check if username is being updated and already exists
    if (username) {
      const existingUser = await getUserByUsername(username);
      if (existingUser && existingUser.id !== parseInt(userId)) {
        throw new Error(`Username ${username} is already taken`);
      }
    }

    // Construct the query based on what data is provided
    let query = 'UPDATE users SET ';
    const queryValues = [];
    let counter = 1;

    if (username) {
      query += `username = $${counter}, `;
      queryValues.push(username);
      counter++;
    }

    if (isAdmin !== undefined) {
      query += `"isAdmin" = $${counter}, `;
      queryValues.push(isAdmin);
      counter++;
    }

    // Remove trailing comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause and return the updated user
    query += ` WHERE id = $${counter} RETURNING id, username, "isAdmin";`;
    queryValues.push(userId);

    const { rows: [updatedUser] } = await client.query(query, queryValues);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};


const deleteUserById = async (userId) => {
  try {
    const { rows: [deletedUser] } = await client.query(`
      DELETE FROM users WHERE id = $1 RETURNING *;
    `, [userId]);

    return deletedUser;
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
  updateUserById,
  deleteUserById
};
