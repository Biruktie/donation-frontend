// src/pages/Login.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // 🔄 If user is already logged in, go directly to dashboard
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.role === "ngo") {
      navigate(`/ngo-dashboard/${savedUser.id || savedUser._id}`);
    } else if (savedUser?.role === "donor") {
      navigate(`/donor-dashboard/${savedUser.id || savedUser._id}`);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailNotFound(false);
    setWrongPassword(false);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      // Expect backend to return: { token, user: { _id, name, email, role } }
      const { token, user } = res.data;
      const userId = user._id || user.id;

      // ✅ Save in AuthContext and localStorage
      login(user, token);

      // Redirect by role
      if (user.role === "ngo") {
        navigate(`/ngo-dashboard/${userId}`);
      } else if (user.role === "donor") {
        navigate(`/donor-dashboard/${userId}`);
      } else {
        setError("Invalid user role");
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = (err.response?.data?.message || "Login failed").toLowerCase();

      if (status === 404 || msg.includes("email not found")) {
        setEmailNotFound(true);
        setError("Email not found");
      } else if (
        status === 401 &&
        (msg.includes("incorrect") || msg.includes("password"))
      ) {
        setWrongPassword(true);
        setError("Incorrect password");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Login
        </h2>

        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        {/* Email Input */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailNotFound(false);
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setWrongPassword(false);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              required
            />

            {/* Toggle Password Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <div className="relative">
                {/* Eye Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 5-4 9-10 9S2 17 2 12s4-9 10-9 10 4 10 9z"
                  />
                </svg>

                {/* Slash when hidden */}
                {!showPassword && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Email Not Found Section */}
        {emailNotFound && (
          <div className="flex items-center justify-center mt-4 mb-2">
            <span className="mr-2 text-green-700 font-medium">
              Create new account?
            </span>
            <button
              type="button"
              className="bg-green-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-500 transition"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          Login
        </button>

        {/* Default Register CTA */}
        {!emailNotFound && (
          <div className="flex items-center justify-center mt-4 mb-2">
            <span className="mr-2 text-green-700 font-medium">
              Create new account?
            </span>
            <button
              type="button"
              className="bg-green-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-500 transition"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
