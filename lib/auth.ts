import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export interface CustomUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@email.com" },
        password: { label: "Password", type: "password", placeholder: "******" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        try {
          return await login(credentials);
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as CustomUser;
        token.accessToken = (user as CustomUser).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as CustomUser;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

async function login(credentials: any): Promise<CustomUser | null> {
  try {
    const { callbackUrl, ...filteredCredentials } = credentials;
    const res = await axios.post("http://192.168.0.153:8014/api/auth/login", filteredCredentials);
    const accessToken = res.data.value.accessToken;
    const userResponse = await axios.get("http://192.168.0.153:8014/api/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userResponse.data.value.user;

    return {
      id: user.id || user.userId,
      name: user.username || user.fullName,
      email: user.email,
      image: user.profilePicture || null,
      accessToken,
    };
  } catch (e) {
    console.error("Login error:", e);
    return null;
  }
}
