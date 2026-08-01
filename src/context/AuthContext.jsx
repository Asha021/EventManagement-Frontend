import React, { createContext, useContext, useEffect, useState } from "react";
import { dummyUsers } from "../data/users";

const AuthContext = createContext(null);

function fakeToken(user) {
  const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + 86400000 }));
  return `demo.${payload}.token`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("cf_user");
    const token = localStorage.getItem("cf_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function login(email, password) {
    const found = dummyUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) {
      return { ok: false, error: "Invalid email or password." };
    }
    const { password: _pw, ...safeUser } = found;
    localStorage.setItem("cf_user", JSON.stringify(safeUser));
    localStorage.setItem("cf_token", fakeToken(found));
    setUser(safeUser);
    return { ok: true };
  }

  function register(name, email, password) {
    const exists = dummyUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = {
      id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      email,
      password,
      role: "user",
    };
    dummyUsers.push(newUser);
    const { password: _pw, ...safeUser } = newUser;
    localStorage.setItem("cf_user", JSON.stringify(safeUser));
    localStorage.setItem("cf_token", fakeToken(newUser));
    setUser(safeUser);
    return { ok: true };
  }

  function logout() {
    localStorage.removeItem("cf_user");
    localStorage.removeItem("cf_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
