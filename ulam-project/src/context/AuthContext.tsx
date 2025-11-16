// src/context/AuthContext.tsx
import React, {createContext, useContext, useState, useEffect,} from "react";
import type { ReactNode } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

type User = {
  id: number;
  name: string;
  email?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "ulam_auth";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // 🔁 Rehydrate auth from localStorage on first load
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { user: User; token: string };
        if (parsed?.user && parsed?.token) {
          setUser(parsed.user);
          setToken(parsed.token);
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsAuthReady(true);
    }
  }, []);

  const persistAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Login error body:", text);
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    // adjust these keys if your API returns different names
    const loggedInUser = data.user as User;
    const authToken = data.token as string;

    persistAuth(loggedInUser, authToken);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Register error body:", text);
      throw new Error("Registration failed");
    }

    const data = await res.json();
    const newUser = data.user as User;
    const authToken = data.token as string;

    persistAuth(newUser, authToken);
  };

  const logout = async () => {
    try {
      // optional: call logout endpoint if you have one
      if (token) {
        await fetch(`${API_BASE}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
      // ignore minor errors
    } finally {
      clearAuth();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthReady,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
