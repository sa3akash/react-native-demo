import { Elysia } from "elysia";
import { bearer } from "@elysia/bearer";
import CustomError from "./error";

type Role = "admin" | "manager" | "superAdmin" | "agent";

interface AuthState {
  user: { name: string; role: Role };
}

export const auth = new Elysia()
  .use(bearer())
  .macro("isAuth", {
    resolve: ({ bearer, headers, cookie }) => {
      if (!bearer) {
        throw new CustomError("Unauthorized", 401);
      }

      return {
        user: { name: "saltyaom", role: "admin" as const },
      };
    },
  })
  .macro("isRole", {
    isAuth: true, // ← extends isAuth so `user` is inferred
    beforeHandle:
      ({ user, set }) =>
      (role: Role) => {
        if (user.role !== role) {
          set.status = 403;
          return "Forbidden";
        }
      },
  });
