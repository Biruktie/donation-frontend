// src/components/ProfileDrawer.jsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUserEdit,
  FaCog,
  FaGift,
  FaBullhorn,
  FaBell,
  FaMoon,
  FaSignOutAlt,
  FaQuestionCircle,
  FaLanguage,
} from "react-icons/fa";

export default function ProfileDrawer({ open, onClose, onLogout }) {
  const { user, logout } = useContext(AuthContext);
  const userId = user?.id || user?._id || user?.userId;
  const navigate = useNavigate();

  // Close drawer on ESC
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      onClose();
    }
  };

  const handleViewProfile = () => {
    if (user.role === "ngo") {
      navigate(`/ngo-dashboard/${userId}`);
    } else {
      navigate(`/profile/${userId}`);
    }
    onClose();
  };

  // Render even when closed so we can animate the slide out
  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none" aria-hidden={!open}>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          open
            ? "opacity-40 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* drawer panel */}
      <aside
        className={`absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out pointer-events-auto flex flex-col`}
        style={{
          transform: open ? "translateX(0%)" : "translateX(100%)",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-lg p-1 z-10"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Profile summary card */}
          <div className="p-6 pb-4 flex flex-col items-center bg-green-50 rounded-b-xl mb-2">
            {user?.role === "ngo" && user?.logoUrl ? (
              <img
                src={`http://localhost:3000${user.logoUrl}`}
                alt="NGO Logo"
                className="w-16 h-16 rounded-full object-cover border border-green-200 mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-2xl font-bold text-green-800 mb-2">
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </div>
            )}
            <div className="text-lg font-bold text-green-800 text-center">
              {user?.name || "User"}
            </div>
            <div className="text-gray-600 text-sm text-center">
              {user?.email}
            </div>
            <button
              onClick={handleViewProfile}
              className="mt-2 text-green-700 text-sm underline hover:text-green-900 bg-transparent border-none p-0 cursor-pointer"
              type="button"
            >
              View profile
            </button>
          </div>

          <div className="flex flex-col gap-2 p-4">
            {/* 1. Dashboard */}
            {user?.role === "donor" && (
              <Link
                to={`/donor-dashboard/${userId || ""}`}
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            )}
            {user?.role === "ngo" && (
              <Link
                to={`/ngo-dashboard/${userId || ""}`}
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
              >
                <FaTachometerAlt /> Dashboard
              </Link>
            )}

            {/* 2. Edit Profile */}
            <Link
              to={
                user?.role === "ngo"
                  ? `/ngo-dashboard/${userId}`
                  : `/profile/${userId}`
              }
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
            >
              <FaUserEdit /> Edit Profile
            </Link>

            {/* 3. Settings */}
            <Link
              to="/settings"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
            >
              <FaCog /> Settings
            </Link>

            {/* 4. My Donations / My Campaigns */}
            {user?.role === "donor" && (
              <Link
                to="/my-donations"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
              >
                <FaGift /> My Donations
              </Link>
            )}
            {user?.role === "ngo" && (
              <Link
                to="/my-campaigns"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
              >
                <FaBullhorn /> My Campaigns
              </Link>
            )}

            {/* 5. Notifications */}
            <Link
              to="/notifications"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
            >
              <FaBell /> Notifications
            </Link>

            {/* 6. Theme Toggle */}
            <button
              className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
              // onClick={toggleTheme}
            >
              <FaMoon /> Theme <span>🌞/🌙</span>
            </button>

            {/* 7. Language Switcher */}
            <button className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 text-left w-full flex items-center gap-2 text-sm">
              <FaLanguage /> Language: EN | አማ | ORO
            </button>

            {/* 8. Help/Support */}
            <Link
              to="/help"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-sm"
            >
              <FaQuestionCircle /> Need help?
            </Link>

            <div className="border-t pt-4">
              <button
                onClick={handleLogoutClick}
                className="w-full px-3 py-1.5 rounded-lg hover:bg-green-50 text-green-700 flex items-center gap-2 text-left text-sm"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Pinned bottom info */}
        <div className="px-4 pb-4 text-xs text-center text-gray-400">
          Signed in as <span className="text-gray-600">{user?.role}</span>
        </div>
      </aside>
    </div>,
    document.body
  );
}
