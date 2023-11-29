require("dotenv").config();
const client = require("./index"); 
const bcrypt = require('bcrypt'); 


const { createUser } = require("./users");
const { createProduct } = require("./products");
const { createCategory } = require("./categories");
const { createOrder } = require("./orders");


const withTransaction = async (callback) => {
  try {
    await client.query('BEGIN');
    await callback();
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const seedDB = async () => {
  await withTransaction(async () => {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCategories();
    await createInitialOrders();
  });
  console.log("db has been successfully seeded!");
};

const dropTables = async () => {
  console.log("Starting to drop tables");
  await client.query(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products_categories;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
  `);
  console.log("Tables dropped...");
};

const createTables = async () => {
  console.log("Starting to create tables");
  await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "isAdmin" boolean DEFAULT false
    );

    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      imgurl TEXT NOT NULL,
      stock INTEGER NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE products_categories(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "categoryId" INTEGER REFERENCES categories(id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id),
      "isPurchased" BOOLEAN DEFAULT false
    );

    CREATE TABLE order_items(
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders(id),
      "productId" INTEGER REFERENCES products(id),
      UNIQUE ("productId", "orderId"),
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
  console.log("Tables created...");
};

async function createInitialUsers() {
  console.log("Starting to create users...");
  
  console.log("Finished creating users!");
}

async function createInitialProducts() {
  console.log("Starting to add products...");
 
  console.log("Finished adding the products...");
}

async function createInitialCategories() {
  console.log("Starting to add categories...");
  
  console.log("Finished adding the categories...");
}

async function createInitialOrders() {
  console.log("Starting to create orders...");
  
  console.log("Finished to create orders");
}

seedDB().catch(console.error);
