import { dbProvider, query } from "../config/database";

export async function initDatabase() {
  if (dbProvider === "sqlite") {
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        hash_password TEXT NOT NULL,
        login TEXT UNIQUE NOT NULL,
        number_phone TEXT NOT NULL,
        data TEXT NOT NULL,
        confirmed INTEGER DEFAULT 0,
        role TEXT NOT NULL DEFAULT 'customer',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_online TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        load_address TEXT NOT NULL,
        unload_address TEXT NOT NULL,
        product_type TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        loading_method TEXT NOT NULL,
        pump_required INTEGER NOT NULL,
        price INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        listing_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        rate INTEGER,
        receiver_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        read INTEGER DEFAULT 0
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    return;
  }

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      hash_password VARCHAR(255) NOT NULL,
      login VARCHAR(255) UNIQUE NOT NULL,
      number_phone VARCHAR(255) NOT NULL,
      data VARCHAR(255) NOT NULL,
      confirmed BOOLEAN DEFAULT FALSE,
      role VARCHAR(255) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT NOW(),
      last_online TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
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

  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      listing_id INT NOT NULL,
      customer_id INT NOT NULL,
      rate INT,
      receiver_id INT NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT 'draft',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS chats (
      id SERIAL PRIMARY KEY,
      listing_id INT NOT NULL,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      chat_id INT NOT NULL,
      sender_id INT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      read BOOLEAN DEFAULT FALSE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      listing_id INT NOT NULL,
      user_id INT NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
