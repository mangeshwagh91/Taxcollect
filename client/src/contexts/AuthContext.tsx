import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/data/mockData";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: "admin" | "citizen") => boolean;
  signup: (name: string, email: string, password: string, role: "admin" | "citizen") => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: "admin" | "citizen") => {
    setUser({
      id: "usr-" + Math.random().toString(36).slice(2),
      name: role === "admin" ? "Admin Officer" : "Citizen User",
      email,
      role,
    });
    return true;
  };

  const signup = (name: string, email: string, _password: string, role: "admin" | "citizen") => {
    setUser({ id: "usr-" + Math.random().toString(36).slice(2), name, email, role });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
