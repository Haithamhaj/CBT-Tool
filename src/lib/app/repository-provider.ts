import { Pool } from "pg";
import { InMemoryRepository } from "../db/in-memory-repository";
import { PostgresRepository } from "../db/postgres-repository";
import { ResilientRepository } from "../db/resilient-repository";
import type { Repository } from "../db/repository";
import { requireDatabaseUrl } from "./runtime-env";

declare global {
  // eslint-disable-next-line no-var
  var __cbt_repository__: Repository | undefined;
  // eslint-disable-next-line no-var
  var __cbt_pool__: Pool | undefined;
}

function createRepository(): Repository {
  const fallback = new InMemoryRepository();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.warn("[repository.fallback] DATABASE_URL is missing, using in-memory repository");
    return fallback;
  }

  const pool =
    globalThis.__cbt_pool__ ??
    new Pool({
      connectionString: requireDatabaseUrl()
    });
  globalThis.__cbt_pool__ = pool;
  return new ResilientRepository(PostgresRepository.fromConnection(pool), fallback);
}

export function getAppRepository(): Repository {
  if (!globalThis.__cbt_repository__) {
    globalThis.__cbt_repository__ = createRepository();
  }

  return globalThis.__cbt_repository__;
}
