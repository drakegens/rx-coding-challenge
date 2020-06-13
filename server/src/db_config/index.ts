import { TinyPg } from "tinypg";

export async function dbNow(db: TinyPg): Promise<Date> {
  return db.sql<{ now: Date }>("common.now").then((res) => res.rows[0].now);
}
