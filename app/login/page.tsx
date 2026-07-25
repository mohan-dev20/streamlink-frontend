"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect ,useState } from "react";
import { Mail, Lock, Eye, EyeOff, Play } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        },
      );

      const data = await response.json();

      const state = localStorage.getItem("state") || "";

      const southStates = [
        "Karnataka",
        "Tamil Nadu",
        "Kerala",
        "Andhra Pradesh",
        "Telangana",
      ];

      if (data.success) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        localStorage.setItem("pendingEmail", email);

        localStorage.setItem("plan", data.user.plan);
        localStorage.setItem("plan", data.user.plan || "FREE");

window.dispatchEvent(new Event("planChanged"));
        if (southStates.includes(state)) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
            }),
          });

          setMessage("📧 Email OTP Sent to your email address.");
          setMessageType("success");
        } else {
          localStorage.setItem("mobileOtp", "123456");

          setMessage("📱 Mobile OTP Sent successfully.");
          setMessageType("success");
        }

        router.push("/verify-otp");
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.log(error);
      setMessage("Login Failed. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
    
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#2563eb33,transparent_40%)]"></div>

      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8"
      >
        {/* Logo */}

        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-xl">
            <Play size={34} fill="white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">StreamLink</h1>

        <p className="text-center text-gray-400 mb-8">Welcome Back 👋</p>

        {/* Email */}

        <div className="relative mb-5">
          <Mail size={20} className="absolute left-4 top-4 text-gray-400" />

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Password */}

        <div className="relative mb-6">
          <Lock size={20} className="absolute left-4 top-4 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-blue-500 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {message && (
          <div
            className={`mb-5 rounded-xl px-4 py-3 text-center font-medium transition-all ${
              messageType === "success"
                ? "bg-green-500/20 border border-green-500 text-green-400"
                : "bg-red-500/20 border border-red-500 text-red-400"
            }`}
          >
            {message}
          </div>
        )}
        {/* Login */}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-bold text-lg disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Register */}

        <p className="text-center text-gray-400 mt-8">
          Don't have an account?
          <Link href="/register" className="text-blue-500 ml-2 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
