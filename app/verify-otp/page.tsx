"use client";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const router = useRouter();
  const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState<
  "success" | "error" | ""
>("");
const [loading, setLoading] = useState(false);
useEffect(() => {
  if (timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft]);
  const verifyOtp = async () => {
    setLoading(true);
setMessage("");

    const state = localStorage.getItem("state") || "";

    const southStates = [
      "Karnataka",
      "Tamil Nadu",
      "Kerala",
      "Andhra Pradesh",
      "Telangana",
    ];

    if (southStates.includes(state)) {
      const email = localStorage.getItem("pendingEmail");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("OTP Verified Successfully");


setTimeout(() => {
  router.push("/");
}, 1500);

        localStorage.removeItem("pendingEmail");

        
      } else {
    toast.error(data.message)
      }
    } else {
      const mobileOtp = localStorage.getItem("mobileOtp");

      if (otp === mobileOtp) {
        setMessage("OTP Verified Successfully");
setMessageType("success");

setTimeout(() => {
  router.push("/");
}, 1500);

        localStorage.removeItem("mobileOtp");

      
      } else {
       setMessage("Invalid OTP");
setMessageType("error");
      }
    }
    setLoading(false);
  };
const resendOtp = async () => {
  const state = localStorage.getItem("state") || "";

  const southStates = [
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Andhra Pradesh",
    "Telangana",
  ];

  if (southStates.includes(state)) {
    const email = localStorage.getItem("pendingEmail");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/otp/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await res.json();

if (!res.ok || !data.success) {
  toast.error(data.message || "Failed to send OTP");
  return;
}

toast.success("New OTP Sent");
  } else {
    localStorage.setItem("mobileOtp", "123456");
    toast.success("New OTP Sent");
  }

  setTimeLeft(300);
  setOtp("");
};
const minutes = Math.floor(timeLeft / 60);
const seconds = timeLeft % 60;
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6">

    <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8">

      <div className="text-center mb-8">

        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">
          🔐
        </div>

        <h1 className="text-3xl font-bold">
          Verify OTP
        </h1>

        <p className="text-gray-400 mt-2">
          Enter the OTP sent to your Email/Mobile
        </p>

      </div>

      {message && ( 
        <div
          className={`mb-5 p-3 rounded-xl text-center font-medium ${
            messageType === "success"
              ? "bg-green-600/20 text-green-400 border border-green-500"
              : "bg-red-600/20 text-red-400 border border-red-500"
          }`}
        >
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-green-500 outline-none text-center text-2xl tracking-[8px]"
      />
      <div className="flex justify-center mt-5 mb-5">

  <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center text-2xl font-bold shadow-lg">

    {minutes}:{seconds.toString().padStart(2, "0")}

  </div>

</div>

<p className="text-center text-gray-400 mb-4">
  OTP expires in
</p>
<div className="mt-6 flex flex-col gap-4">

  <button
    onClick={verifyOtp}
    disabled={loading || timeLeft === 0}
    className={`w-full py-3 rounded-xl font-semibold transition ${
      loading || timeLeft === 0
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {loading
      ? "Verifying..."
      : timeLeft === 0
      ? "OTP Expired"
      : "Verify OTP"}
  </button>

  {timeLeft === 0 ? (
    <button
      onClick={resendOtp}
      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold"
    >
      Resend OTP
    </button>
  ) : (
    <p className="text-center text-gray-400">
      Didn't receive the OTP?
    </p>
  )}

</div>

    </div>

  </div>
);
}
