import { Elysia } from "elysia";
import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";

export const rootModule = new Elysia()
  .use(cors())
  .use(openapi())

  .get("/", () => {
    return {
      message: "Hello World!",
    };
  });
