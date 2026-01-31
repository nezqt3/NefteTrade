import { pool } from "../../config/database";
import { User } from "./users.types";

export async function createUser(
  email: string,
  hash_password: string,
  login: string,
  numberPhone: string,
  data: string,
  role: string,
): Promise<User> {
  const query =
    "INSERT INTO users (email, hash_password, login, numberPhone, data, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, login, numberPhone, data, role";
  const values = [email, hash_password, login, numberPhone, data, role];
  const { rows } = await pool.query<User>(query, values);

  return rows[0] ?? null;
}

export async function getUser(login: string) {
  const query = "SELECT * FROM users WHERE login = $1";
  const values = [login];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function setUserOnline(userId: number) {
  const now = new Date();
  const query = "UPDATE users SET last_online = $1 WHERE id = $2";
  const values = [now, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function getStatus(userId: number) {
  const query = "SELECT last_online FROM users WHERE id = $1";
  const values = [userId];
  const result = await pool.query(query, values);
  return result.rows[0];
}
