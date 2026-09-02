"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
  user: any; // Bisa dikustom sesuai kebutuhan
  accessToken: string | null;
  setUser: (user: any | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(session?.user || null);
  const [accessToken, setAccessToken] = useState<string | null>(session?.accessToken || null);

  useEffect(() => {
    if (session?.user && session?.accessToken) {
      setUser(session.user);
      setAccessToken(session.accessToken); // Simpan accessToken
      localStorage.setItem("user", JSON.stringify(session.user));
    }
  }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/sambung");
  }

  return <UserContext.Provider value={{ user, accessToken, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
