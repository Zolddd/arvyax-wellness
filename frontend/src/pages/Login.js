import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Email validation
    if (!email.includes("@") || !/\S+@\S+\.\S+/.test(email)) {
      setMessageType("error");
      setMessage("⚠ Please enter a valid email address.");
      triggerShake();
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);

      setMessageType("success");
      setMessage("✅ Login successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch {
      setMessageType("error");
      setMessage("❌ Incorrect email or password. Please try again.");
      triggerShake();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-700 to-emerald-600 flex items-center justify-center px-4">
      <motion.div
        animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-xl shadow-2xl p-8 sm:p-10 rounded-2xl w-full max-w-md border border-white/20"
      >
        {/* Logo & Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white/20 p-3 rounded-full shadow-md">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3064/3064155.png"
              alt="Login icon"
              className="w-16 h-16"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center mt-5">
            Welcome Back
          </h2>
          <p className="text-sm text-white/80 mt-1 text-center max-w-xs">
            Log in to continue your wellness journey 🌿
          </p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-3 rounded-lg text-sm font-medium ${
                messageType === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-white/90 text-sm mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none placeholder-white/70"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/90 text-sm mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-400 outline-none pr-12 placeholder-white/70"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 flex items-center justify-center text-white/70 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Log In
          </button>

          {/* Register Link */}
          <p className="text-sm text-center text-white/80">
            Don&apos;t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-white font-semibold underline cursor-pointer hover:text-green-300"
            >
              Register here
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
