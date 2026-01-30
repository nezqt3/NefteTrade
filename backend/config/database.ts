const { Client } = require('pg');
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
        console.error('Error connecting to the database:', error);
        throw error;
    }

    const result = await client.query(`CREATE TABLE IF NOT EXISTS users (
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

    return client
}