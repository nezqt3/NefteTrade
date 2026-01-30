import { connectToDatabase } from "../../config/database";

export async function createUser(email: string, hash_password: string, login: string, numberPhone: string, data: string, role: string) {
    const client = await connectToDatabase();
    const query = "INSERT INTO users (email, hash_password, login, numberPhone, data, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [email, hash_password, login, numberPhone, data, role];
    const result = await client.query(query, values);

    if (!result) {
        throw new Error("Failed to create user");
    }

    return result.rows[0];
}

export async function getUser(login: string) {
    const client = await connectToDatabase();
    const query = "SELECT * FROM users WHERE login = $1";
    const values = [login];
    const result = await client.query(query, values);
    return result.rows[0];
}