import "dotenv/config";
import path from "path";
import { Pool } from "pg";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

export type DbProvider = "postgres" | "sqlite";

const rawProvider =
  process.env.DB_PROVIDER ??
  process.env.DATABASE_PROVIDER ??
  process.env.DB_DRIVER ??
  "sqlite";

export const dbProvider: DbProvider =
  rawProvider.toLowerCase() === "postgres" ? "postgres" : "sqlite";

let pgPool: Pool | null = null;
let sqliteDb: Database<sqlite3.Database, sqlite3.Statement> | null = null;

function getPgPool() {
  if (!pgPool) {
    pgPool = new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: Number(process.env.POSTGRES_PORT),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pgPool;
}

async function getSqliteDb() {
  if (!sqliteDb) {
    const filename =
      process.env.SQLITE_PATH ?? path.resolve(process.cwd(), "database.sqlite");
    sqliteDb = await open({
      filename,
      driver: sqlite3.Database,
    });
    await sqliteDb.exec("PRAGMA foreign_keys = ON;");
  }
  return sqliteDb;
}

function isReturningQuery(sql: string) {
  return /\bRETURNING\b/i.test(sql);
}

function isSelectQuery(sql: string) {
  return /^\s*(SELECT|WITH|PRAGMA)\b/i.test(sql);
}

function toSqliteQuery(sql: string, params: unknown[]) {
  const outParams: unknown[] = [];
  const pattern = /=\s*ANY\(\$(\d+)\)|\$(\d+)/g;
  let lastIndex = 0;
  let resultSql = "";
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(sql))) {
    resultSql += sql.slice(lastIndex, match.index);
    if (match[1]) {
      const paramIndex = Number(match[1]) - 1;
      const value = params[paramIndex];
      if (Array.isArray(value)) {
        if (value.length === 0) {
          resultSql += "IN (NULL)";
        } else {
          resultSql += `IN (${value.map(() => "?").join(", ")})`;
          outParams.push(...value);
        }
      } else {
        resultSql += "IN (?)";
        outParams.push(value);
      }
    } else if (match[2]) {
      const paramIndex = Number(match[2]) - 1;
      resultSql += "?";
      outParams.push(params[paramIndex]);
    }
    lastIndex = pattern.lastIndex;
  }

  resultSql += sql.slice(lastIndex);
  return { sql: resultSql, params: outParams };
}

export async function query<T extends Record<string, any>>(
  text: string,
  params: unknown[] = [],
): Promise<{ rows: T[] }> {
  if (dbProvider === "postgres") {
    const pool = getPgPool();
    const result = await pool.query<T>(text, params as any[]);
    return { rows: result.rows };
  }

  const { sql, params: sqliteParams } = toSqliteQuery(text, params);
  const db = await getSqliteDb();

  if (isSelectQuery(sql) || isReturningQuery(sql)) {
    const rows = (await db.all(sql, sqliteParams)) as T[];
    return { rows };
  }

  await db.run(sql, sqliteParams);
  return { rows: [] };
}

export async function closeDatabase() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
  if (sqliteDb) {
    await sqliteDb.close();
    sqliteDb = null;
  }
}
