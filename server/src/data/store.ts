import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Database } from "../types/models.js";
import { createSeedData } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "db.json");

let dbCache: Database | null = null;

async function readFileIfExists(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function loadDb(): Promise<Database> {
  if (dbCache) return dbCache;

  const raw = await readFileIfExists(dbPath);
  if (!raw) {
    dbCache = await createSeedData();
    await saveDb(dbCache);
    return dbCache;
  }

  dbCache = JSON.parse(raw) as Database;
  return dbCache;
}

export async function saveDb(nextDb: Database): Promise<void> {
  dbCache = nextDb;
  await fs.writeFile(dbPath, JSON.stringify(nextDb, null, 2), "utf8");
}

export async function withDb<T>(mutate: (db: Database) => T | Promise<T>): Promise<T> {
  const current = await loadDb();
  const result = await mutate(current);
  await saveDb(current);
  return result;
}
