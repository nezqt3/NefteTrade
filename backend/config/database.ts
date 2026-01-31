import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query<T = any>(
  text: string,
  params?: any[],
): Promise<T[]> {
  const { rows } = await pool.query(text, params);
  return rows;
}
