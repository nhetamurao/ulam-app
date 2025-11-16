import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/ulam-logo.svg";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
      navigate("/");
    } catch {
      /* ignore */
    }
  };

  // 🔥 CLICK OUTSIDE TO CLOSE DROPDOWN
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // If clicking outside dropdown & button, close it
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all duration-200 ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-200 ${
          isScrolled ? "py-2" : "py-3"
        }`}
      >
        {/* LEFT: Logo + Navigation */}
        <div className="flex items-center gap-6">
          <Link to="/">
            <img
              src={Logo}
              className={`transition-all duration-200 ${
                isScrolled ? "h-7" : "h-8"
              }`}
              alt="Ulam"
            />
          </Link>

          <div className="hidden md:flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1 text-sm rounded-full transition ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `px-3 py-1 text-sm rounded-full transition ${
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-700 hover:bg-gray-200"
                }`
              }
            >
              Discover
            </NavLink>
          </div>
        </div>

        {/* RIGHT: Authenticated */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/gems/new"
              className="flex items-center gap-1 px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-semibold shadow hover:bg-orange-700 transition"
            >
              Add a Post
            </Link>

            {/* User Pill + Dropdown */}
            <div className="relative flex items-center">
              <button
                ref={buttonRef}
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition"
              >
                Welcome, {user.name}!
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-orange-600 text-white text-sm font-semibold">
                  {userInitial}
                </div>
              </button>

              {isMenuOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl border shadow-md py-1 z-20 animate-fadeIn"
                >
                  <button
                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 text-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 text-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Unauthenticated
          <div className="flex items-center gap-2">
            <Link
              to="/signup"
              className="rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm font-medium text-orange-600 shadow-sm hover:bg-orange-50"
            >
              Sign Up
            </Link>

            <Link
              to="/login"
              className="rounded-full bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white shadow hover:bg-orange-700"
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;