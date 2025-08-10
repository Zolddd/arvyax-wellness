import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const navigate = useNavigate();

  const triggerShake = () => {
    const formBox = document.querySelector(".form-container");
    formBox.classList.remove("shake");
    void formBox.offsetWidth;
    formBox.classList.add("shake");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessageType("error");
      setMessage("⚠ Please enter your full name.");
      triggerShake();
      return;
    }

    if (!email.includes("@") || !/\S+@\S+\.\S+/.test(email)) {
      setMessageType("error");
      setMessage("⚠ Please enter a valid email address.");
      triggerShake();
      return;
    }

    if (password.length < 6) {
      setMessageType("error");
      setMessage("⚠ Password must be at least 6 characters.");
      triggerShake();
      return;
    }

    try {
      await axios.post("http://localhost:8000/auth/register", {
        name,
        email,
        password,
      });

      setMessageType("success");
      setMessage("✅ Registered successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch {
      setMessageType("error");
      setMessage("❌ Registration failed! Email may already exist.");
      triggerShake();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-700 to-emerald-600 flex items-center justify-center px-4">
      <div className="form-container bg-white/20 backdrop-blur-xl shadow-xl p-8 sm:p-10 rounded-2xl w-full max-w-md animate-fade-in">
        
        {/* Icon + Heading */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Register icon"
            className="w-14 h-14 mb-2"
          />
          <h2 className="text-3xl font-extrabold text-white text-center">
            Create an Account
          </h2>
          <p className="text-sm text-white/80 mt-1 text-center">
            Start your wellness journey today ✨
          </p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm ${
              messageType === "success"
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-300 outline-none placeholder-white/80"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-300 outline-none placeholder-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              className="w-full px-4 py-3 border border-white/30 bg-white/10 text-white rounded-lg focus:ring-2 focus:ring-green-300 outline-none pr-10 placeholder-white/80"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <EyeSlashIcon
                className="w-5 h-5 text-white/70 absolute top-3.5 right-3 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <EyeIcon
                className="w-5 h-5 text-white/70 absolute top-3.5 right-3 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
          >
            Register
          </button>
          <p className="text-sm text-center text-white/80">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-white font-medium underline cursor-pointer hover:text-green-300"
            >
              Log in
            </span>
          </p>
        </form>
      </div>

      {/* Shake Animation */}
      <style>{`
        .shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
