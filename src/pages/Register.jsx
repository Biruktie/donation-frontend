import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Replace with your actual register API endpoint
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          Register
        </h2>

        {success && (
          <div className="mb-4 text-green-600 text-center">{success}</div>
        )}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        {error && error.toLowerCase().includes("already registered") ? (
          <>
            <div className="mb-2 text-red-600 text-center w-full">{error}</div>
            <button
              type="button"
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
              onClick={() => navigate("/login")}
            >
              Login instead
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
          >
            Register
          </button>
        )}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="text-green-700 underline hover:text-green-900 font-medium"
            onClick={() => navigate("/ngo-register")}
          >
            Register as NGO
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
