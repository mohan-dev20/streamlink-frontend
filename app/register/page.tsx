"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
export default function Register() {
  const [fromData, setFromData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromData({
      ...fromData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (fromData.password !== fromData.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: fromData.username,
            email: fromData.email,
            password: fromData.password,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Registration Successful");
        setMessageType("success");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message || "Registration Failed");
        setMessageType("error");
      }
    } catch (error) {
      console.log(error);
      setMessage("Server Error");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-4xl mb-4">
            ▶
          </div>

          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="text-gray-400 mt-2">Join StreamLink</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-4 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {message && (
            <div
              className={`rounded-xl p-3 text-center ${
                messageType === "success"
                  ? "bg-green-500/20 text-green-400 border border-green-500"
                  : "bg-red-500/20 text-red-400 border border-red-500"
              }`}
            >
              {message}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-bold transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-400">
            Already have an account?
            <Link
              href="/login"
              className="text-blue-400 ml-2 hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
