// src/pages/NgoRegister.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const NgoRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [alreadyRegisteredMsg, setAlreadyRegisteredMsg] = useState("");
  const [otherError, setOtherError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlreadyRegisteredMsg("");
    setOtherError("");

    try {
      const res = await axios.post("http://localhost:3000/api/ngo/register", {
        name,
        email,
        password,
        role: "ngo",
        description,
      });

      toast.success(res.data.message || "NGO registered successfully!");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const serverMessage = err.response?.data?.message || "";

      if (serverMessage.toLowerCase().includes("already")) {
        setAlreadyRegisteredMsg(serverMessage);
      } else {
        setOtherError(
          serverMessage || "Registration failed. Please try again."
        );
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
          NGO Registration
        </h2>

        {/* General error */}
        {otherError && (
          <div className="mb-4 text-red-600 text-center">{otherError}</div>
        )}

        {/* NGO Name */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">NGO Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Email */}
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

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="What does your NGO do?"
          />
        </div>

        {/* Password */}
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

        {/* Email already registered message */}
        {alreadyRegisteredMsg ? (
          <div className="w-full flex flex-col items-center mb-4">
            <div className="mb-2 text-red-600 text-center w-full font-medium">
              {alreadyRegisteredMsg}
            </div>
            <div className="w-full flex flex-row items-center gap-2 justify-center">
              <span className="text-green-700 font-medium">Login instead?</span>
              <button
                type="button"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out mb-4"
          >
            Register NGO
          </button>
        )}

        {/* “Already have an account?” only shows when no error */}
        {!alreadyRegisteredMsg && (
          <div className="text-center mt-2">
            <span className="text-gray-700 mr-2">Already have an account?</span>
            <button
              type="button"
              className="text-green-700 font-semibold hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default NgoRegister;
