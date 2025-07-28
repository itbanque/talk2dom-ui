// src/context/UserContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string,
  name: string;
  email: string;
  plan?: string;
  remain_credits?: number;
  subscription_credits?: number;
  one_time_credits?: number;
  subscription_status?: string;
  subscription_end_date?: string;
  is_active: boolean
};

const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN || "";

const UserContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });

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

  return <UserContext.Provider value={{ user, loading }}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);