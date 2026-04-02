import type { Pool, PoolClient } from "pg";
import { SqlRepository } from "./sql-repository";

export class PostgresRepository extends SqlRepository {
  constructor(private readonly connection: Pool | PoolClient) {
    super(connection);
  }

  static fromConnection(connection: Pool | PoolClient) {
    return new PostgresRepository(connection);
  }
}
