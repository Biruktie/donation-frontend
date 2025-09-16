import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const NgoDashboard = () => {
  const { id: userId } = useParams(); // get userId from /ngo-dashboard/:id
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch existing NGO info
  useEffect(() => {
    if (!userId) {
      setError("Missing user id in URL");
      return;
    }
    const fetchNGO = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/ngo/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setName(data.name || "");
          setDescription(data.description || "");
          setStory(data.story || "");
        } else {
          setError(data.message || "Failed to fetch NGO info");
        }
      } catch (err) {
        setError("Network error");
      }
    };

    fetchNGO();
  }, [userId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/ngo/update/${userId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, description, story }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-green-700 text-center">
          NGO Dashboard
        </h2>

        {success && (
          <div className="mb-4 text-green-600 text-center">{success}</div>
        )}
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

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

        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Story</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-500 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default NgoDashboard;
