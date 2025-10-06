import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ProfileDrawer from "./ProfileDrawer";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login");
    window.location.reload(); // to refresh the navbar state
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

  // Get logo URL from local storage
  const logoUrl = JSON.parse(localStorage.getItem("user"))?.logoUrl;

  return (
    <nav
      className={`bg-white px-8 pt-4 flex justify-between items-center border-green-300 relative ${
        isAnyActive ? "border-b" : "border-b-2"
      }`}
      style={{ overflow: "visible" }}
    >
      <Link to="/" className="text-xl font-bold text-green-700">
        Bright Ethiopia
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
                borderBottom: "none",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                background: isRegister
                  ? undefined
                  : isActive
                  ? "#fff"
                  : "transparent",
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
          <>
            {logoUrl ? (
              <img
                src={`http://localhost:3000${logoUrl}`}
                alt="NGO Logo"
                className="h-10 w-10 rounded-full object-cover border border-green-200 cursor-pointer ml-4"
                title="Profile"
                onClick={() => setDrawerOpen(true)}
              />
            ) : (
              <FaUserCircle
                className="text-3xl text-green-700 hover:text-green-500 cursor-pointer ml-4"
                title="Profile"
                onClick={() => setDrawerOpen(true)}
              />
            )}
            <ProfileDrawer
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onLogout={handleLogout}
            />
          </>
        )}
      </div>
    </nav>
  );
}
