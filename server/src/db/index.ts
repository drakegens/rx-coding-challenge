import { TinyPg } from "tinypg";
import * as Path from "path";
import { DbFactory } from "../db_config/factory";

export const Db: TinyPg = DbFactory.create({
  root_dir: [Path.join(__dirname)],
  db_connection_url:
    "postgres://postgres:postgres@localhost:5432?sslmode=disable",
  connection_timeout_ms: 30000,
  pool_size: 10,
});
