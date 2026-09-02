import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
    accessToken?: string;
  }

  interface User extends DefaultUser {
    accessToken?: string;
  }
}
