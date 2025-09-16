// src/components/ProfileSummary.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

function ProfileSummary({ compact = false }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const name = user?.name || "Unnamed User";
  const email = user?.email || "";
  const initials = getInitials(name);

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg shadow-sm ${
        compact ? "py-2" : "py-4"
      }`}
      style={{
        background: "#e6f4ea", // light green (matches your site's palette)
        color: "#166534", // dark green for text
        minWidth: 180,
        minHeight: compact ? 80 : 120,
      }}
    >
      {/* Avatar */}
      <div
        className={`flex items-center justify-center rounded-full ${
          compact ? "w-10 h-10 text-base" : "w-14 h-14 text-xl"
        }`}
        style={{
          background: "#bbf7d0", // lighter green for avatar
          color: "#166534",
          marginBottom: compact ? 6 : 10,
        }}
        aria-hidden="true"
      >
        <span className="font-semibold">{initials}</span>
      </div>

      {/* Name */}
      <div className="font-bold text-base" style={{ color: "#166534" }}>
        {name}
      </div>
      {/* Email */}
      {email && (
        <div className="text-xs" style={{ color: "#4b5563" }}>
          {email}
        </div>
      )}
      {/* View Profile Button */}
      {!compact && (
        <button
          onClick={() => navigate(`/profile/${user?.id || user?._id || ""}`)}
          className="mt-2 text-xs text-green-700 hover:underline"
          style={{ background: "none", border: "none", padding: 0 }}
        >
          View profile
        </button>
      )}
    </div>
  );
}

export default ProfileSummary;
