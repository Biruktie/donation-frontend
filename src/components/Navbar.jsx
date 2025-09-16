import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ProfileSummary from "./ProfileSummary";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Log out on tab/browser close or refresh
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
    window.location.reload(); // To update navbar state
  };

  // Check if any tab is active
  const isAnyActive = ["/", "/about", "/login", "/register"].some(
    (path) => location.pathname === path
  );
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/ngos", label: "NGOs" },
    { to: "/about", label: "About" },
  ];
  if (!isLoggedIn) {
    navLinks.push({ to: "/login", label: "Login" });
    navLinks.push({ to: "/register", label: "Register" });
  }
  return (
    <nav
      className={`bg-white px-8 pt-4 flex justify-between items-center border-green-300 relative ${
        isAnyActive ? "border-b" : "border-b-2"
      }`}
      style={{ overflow: "visible" }}
    >
      <Link to="/" className="text-xl font-bold text-green-700">
        Ethiopian NGO Digital Donations
      </Link>
      <div className="flex gap-2 nav items-center">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          const isRegister = link.to === "/register";
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`tab px-5 py-2 font-medium transition-colors duration-200 inline-block
                ${
                  isRegister
                    ? isActive
                      ? "bg-green-700 text-white z-10 hover:bg-green-500 relative"
                      : "bg-green-700 text-white hover:bg-green-500 relative"
                    : isActive
                    ? "active bg-white text-green-700 z-10"
                    : "text-green-700 hover:bg-green-50"
                }`}
              style={{
                border: isActive && !isRegister ? "1px solid #86efac" : "none",
                borderBottom: isActive && !isRegister ? "none" : "none",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                borderBottomLeftRadius: isRegister
                  ? "8px"
                  : isActive && !isRegister
                  ? "8px 8px 0 0"
                  : undefined,
                borderBottomRightRadius: isRegister
                  ? "8px"
                  : isActive && !isRegister
                  ? "8px 8px 0 0"
                  : undefined,
                background: isRegister
                  ? undefined
                  : isActive
                  ? "#fff"
                  : "transparent",
                position: isActive && !isRegister ? "relative" : undefined,
                top:
                  isActive && !isRegister ? 0 : isRegister ? "-2px" : undefined,
                marginBottom: isRegister ? undefined : undefined,
              }}
            >
              {link.label}
              {isActive && !isRegister && (
                <span
                  className="absolute left-0 right-0 -bottom-[3px] h-[6px] bg-white z-20"
                  style={{ pointerEvents: "none" }}
                />
              )}
            </Link>
          );
        })}
        {isLoggedIn && (
          <div className="ml-4 flex items-center relative" ref={dropdownRef}>
            <FaUserCircle
              className="text-3xl text-green-700 hover:text-green-500 cursor-pointer"
              title="Profile"
              onClick={() => setDropdownOpen((open) => !open)}
            />
            {dropdownOpen && (
              <div
                className="fixed sm:absolute right-2 sm:right-0 mt-2 w-[320px] max-w-[95vw] bg-white border border-gray-200 rounded-2xl shadow-lg z-50 animate-fade-in p-0 flex flex-col items-center"
                style={{ top: "60px" }}
              >
                <div className="w-full border-b border-gray-100 pb-2 pt-2 px-2">
                  <ProfileSummary />
                </div>
                <Link
                  to="/dashboard"
                  className="block w-full px-4 py-2 text-green-700 hover:bg-green-50 text-center"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
