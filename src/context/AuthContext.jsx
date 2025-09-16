// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // hydrate synchronously from localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("token") || null;
    } catch {
      return null;
    }
  });

  // tells the app that we've finished hydrating (and/or validating) auth
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // If you want to validate token with backend, do it here, then setReady(true)
    setReady(true);
  }, []);

  const isLoggedIn = Boolean(token);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } catch {}
    try {
      localStorage.setItem("token", nextToken);
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoggedIn, ready, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
