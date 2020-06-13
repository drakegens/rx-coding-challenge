import { TinyPg } from "tinypg";

declare global {
  interface ServiceContext {
    db: TinyPg;
  }
}

export {};
