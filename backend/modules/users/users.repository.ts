import { query } from "../../config/database";
import { User } from "./users.types";

export type UserWithPassword = User & { hash_password: string };

export async function createUser(
  email: string,
  hash_password: string,
  login: string,
  numberPhone: string,
  data: string,
  role: string,
): Promise<User | null> {
  await query(
    "INSERT INTO users (email, hash_password, login, number_phone, data, role) VALUES ($1, $2, $3, $4, $5, $6)",
    [email, hash_password, login, numberPhone, data, role],
  );

  const { rows } = await query<User>(
    `SELECT id, email, login, number_phone as "numberPhone", data, role, last_online, confirmed, created_at
     FROM users
     WHERE login = $1`,
    [login],
  );

  return rows[0] ?? null;
}

export async function getUserForAuth(
  login: string,
): Promise<UserWithPassword | null> {
  const { rows } = await query<UserWithPassword>(
    `SELECT id, email, login, number_phone as "numberPhone", data, role, last_online, confirmed, created_at, hash_password
     FROM users
     WHERE login = $1`,
    [login],
  );
  return rows[0] ?? null;
}

export async function getUserById(userId: number): Promise<User | null> {
  const { rows } = await query<User>(
    `SELECT id, email, login, number_phone as "numberPhone", data, role, last_online, confirmed, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function setUserOnline(userId: number) {
  const now = new Date().toISOString();
  await query("UPDATE users SET last_online = $1 WHERE id = $2", [
    now,
    userId,
  ]);
  const { rows } = await query<User>(
    `SELECT id, email, login, number_phone as "numberPhone", data, role, last_online, confirmed, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

export async function getStatus(userId: number) {
  const { rows } = await query<{ last_online: string }>(
    "SELECT last_online FROM users WHERE id = $1",
    [userId],
  );
  return rows[0] ?? null;
}

export async function confirmedUser(userId: number) {
  await query("UPDATE users SET confirmed = TRUE WHERE id = $1", [userId]);
  const { rows } = await query<User>(
    `SELECT id, email, login, number_phone as "numberPhone", data, role, last_online, confirmed, created_at
     FROM users
     WHERE id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}
