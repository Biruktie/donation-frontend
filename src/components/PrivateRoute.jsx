// src/components/PrivateRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { isLoggedIn, ready } = useContext(AuthContext);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-700">
        Loading…
      </div>
    );
  }
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
