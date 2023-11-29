require('dotenv').config(); 

const { Pool } = require("pg");

let db;

if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  db = new Pool({ 
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: 'localhost', 
    port: 5432, 
  });
}

db.connect()
  .then(() => console.log("Connected to database"))
  .catch(err => console.error("Database connection error", err));

module.exports = db;
