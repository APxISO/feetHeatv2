require('dotenv').config();
const { Pool } = require('pg');

let dbConfig = {};

// Check if the app is running on Heroku
if (process.env.DATABASE_URL) {
    // Configure the database connection for Heroku PostgreSQL
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // Required for Heroku PostgreSQL connection
        }
    };
} else {
    // Local database configuration
    dbConfig = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        port: 5432,
        database: process.env.DB_NAME
    };
}

const db = new Pool(dbConfig);

db.connect()
    .then(() => console.log("Connected to database"))
    .catch(err => console.error("Database connection error", err));

module.exports = db;
