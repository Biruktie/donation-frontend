import React, { useState, useContext } from "react";
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
  const { login } = useContext(AuthContext); // login(user, token)

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

      // Expecting { token, user: { id/_id, role, name, email } }
      const { token, user } = res.data;
      const userId = user.id || user._id;

      // ✅ IMPORTANT: call login with (user, token)
      login(
        { id: userId, role: user.role, name: user.name, email: user.email },
        token
      );

      // Route by role
      if (user.role === "ngo") {
        navigate(`/ngo-dashboard/${userId}`);
      } else {
        navigate(`/donor-dashboard/${userId}`);
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
      } else if (status === 400) {
        setError(err.response?.data?.message || "Bad request");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailNotFound(false);
    if (error === "Email not found") setError("");
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    setWrongPassword(false);
    if (error === "Incorrect password") setError("");
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

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={onEmailChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={onPasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <div className="relative">
                {/* Eye icon */}
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

                {/* Slash line when hidden */}
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

        {/* If email not found, show targeted register prompt here */}
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

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          Login
        </button>

        {/* Default CTA only when email isn't not-found */}
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
