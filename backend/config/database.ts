const { Client } = require("pg");
import "dotenv/config";

export async function connectToDatabase() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }

  await client.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            hash_password VARCHAR(255) NOT NULL,
            login VARCHAR(255) UNIQUE NOT NULL,
            numberPhone VARCHAR(255) NOT NULL,
            data VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL DEFAULT 'customer'
            created_at TIMESTAMP DEFAULT NOW()
        ) 
        `);
  await client.query(`CREATE TABLE IF NOT EXISTS listings (
            id SERIAL PRIMARY KEY,
            owner_id INT NOT NULL,
            load_address VARCHAR(255) NOT NULL,
            unload_address VARCHAR(255) NOT NULL,
            product_type VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            loading_method VARCHAR(255) NOT NULL,
            pump_required BOOLEAN NOT NULL,
            price INT NOT NULL,
            status VARCHAR(255) NOT NULL DEFAULT 'draft'
            created_at TIMESTAMP DEFAULT NOW()
        ) 
        `);

  return client;
}
