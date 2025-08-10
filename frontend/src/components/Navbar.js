import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaFolderOpen,
  FaPlus,
  FaSignInAlt,
  FaSignOutAlt
} from "react-icons/fa";

const navVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function Navbar({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (onMobileMenuToggle) {
      onMobileMenuToggle(mobileOpen);
    }
  }, [mobileOpen, onMobileMenuToggle]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowLogoutConfirm(false);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginClick = () => navigate("/login");

  const protectedNavClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      navigate("/login");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition 
     ${isActive ? "bg-white/10 text-white shadow-md" : "text-white/90 hover:bg-white/5"}`;

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-700 to-emerald-600/95 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <motion.div whileHover={{ scale: 1.07 }} className="text-2xl">
                🌿
              </motion.div>
              <div className="text-white">
                <div className="font-extrabold text-lg leading-none">Arvyax</div>
                <div className="text-xs text-white/80 -mt-0.5">Wellness Sessions</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <NavLink to="/" className={navLinkClass}>
                <FaHome className="opacity-85" /> <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/my-sessions"
                className={navLinkClass}
                onClick={(e) => protectedNavClick(e, "/my-sessions")}
              >
                <FaFolderOpen /> <span>My Sessions</span>
              </NavLink>
              <NavLink
                to="/session-editor"
                className={navLinkClass}
                onClick={(e) => protectedNavClick(e, "/session-editor")}
              >
                <FaPlus /> <span>Create</span>
              </NavLink>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="ml-2 inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
                >
                  <FaSignInAlt />
                  <span className="hidden sm:inline">Login / Signup</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded text-white/90 hover:text-white"
                onClick={() => setMobileOpen((s) => !s)}
              >
                {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={mobileOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden bg-gradient-to-r from-green-700 to-emerald-600/95 px-4 pb-4"
        >
          {mobileOpen && (
            <div className="flex flex-col gap-2 pt-2">
              <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                <FaHome /> Dashboard
              </NavLink>
              <NavLink
                to="/my-sessions"
                className={navLinkClass}
                onClick={(e) => { protectedNavClick(e, "/my-sessions"); setMobileOpen(false); }}
              >
                <FaFolderOpen /> My Sessions
              </NavLink>
              <NavLink
                to="/session-editor"
                className={navLinkClass}
                onClick={(e) => { protectedNavClick(e, "/session-editor"); setMobileOpen(false); }}
              >
                <FaPlus /> Create
              </NavLink>
              <div className="border-t border-white/10 mt-2 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={() => { setShowLogoutConfirm(true); setMobileOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-white/90 hover:bg-white/5 flex items-center gap-2"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                ) : (
                  <button
                    onClick={() => { navigate("/login"); setMobileOpen(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-white/90 hover:bg-white/5 flex items-center gap-2"
                  >
                    <FaSignInAlt /> Login / Signup
                  </button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.nav>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold mb-3">Confirm Logout</h3>
              <p className="text-sm text-gray-500 mb-5">Are you sure you want to log out?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />
    </>
  );
}
