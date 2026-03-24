import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: "admin" | "citizen") => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: "admin" | "citizen") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = "taxcollect.auth";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

interface AuthPayload {
  token: string;
  user: User;
}

function parseErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return "Authentication failed";
}

async function requestAuth(path: "/auth/login" | "/auth/signup", body: unknown): Promise<AuthPayload> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(typeof payload?.message === "string" ? payload.message : "Authentication failed");
  }

  return payload as AuthPayload;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) {
        setIsLoading(false);
        return;
      }

      const parsed = JSON.parse(raw) as AuthPayload;
      if (parsed?.token && parsed?.user) {
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistAuth = (nextAuth: AuthPayload) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    setToken(nextAuth.token);
    setUser(nextAuth.user);
    setAuthError(null);
  };

  const login = async (email: string, password: string, role: "admin" | "citizen") => {
    try {
      const nextAuth = await requestAuth("/auth/login", { email, password, role });
      persistAuth(nextAuth);
      return true;
    } catch (err) {
      setAuthError(parseErrorMessage(err));
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: "admin" | "citizen") => {
    try {
      const nextAuth = await requestAuth("/auth/signup", { name, email, password, role });
      persistAuth(nextAuth);
      return true;
    } catch (err) {
      setAuthError(parseErrorMessage(err));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!user && !!token, isLoading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
