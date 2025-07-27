// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  name: string;
  email: string;
  plan?: string;
  remain_credits?: number;
};

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

const UserContext = createContext<{ user: User | null }>({ user: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${DOMAIN}/api/v1/user/me`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return null;

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);