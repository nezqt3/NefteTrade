import { pool } from "../config/database";

export async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      hash_password VARCHAR(255) NOT NULL,
      login VARCHAR(255) UNIQUE NOT NULL,
      number_phone VARCHAR(255) NOT NULL,
      data VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id SERIAL PRIMARY KEY,
      owner_id INT NOT NULL,
      load_address VARCHAR(255) NOT NULL,
      unload_address VARCHAR(255) NOT NULL,
      product_type VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      loading_method VARCHAR(255) NOT NULL,
      pump_required BOOLEAN NOT NULL,
      price INT NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      listing_id INT NOT NULL,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      chat_id INT NOT NULL,
      sender_id INT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
      read BOOLEAN DEFAULT FALSE
    );
  `);
}
