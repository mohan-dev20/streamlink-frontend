"use client";
import toast from "react-hot-toast";
import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
const plans = [
  {
    name: "FREE",
    price: "₹0",
    icon: "🆓",
    color: "border-slate-600",
    button: "bg-slate-700 hover:bg-slate-600",
    features: ["5 min watch limit", "1 download/day"],
  },
  {
    name: "BRONZE",
    price: "₹99",
    icon: "🥉",
    color: "border-amber-700",
    button: "bg-amber-700 hover:bg-amber-600",
    features: ["7 min watch limit", "5 downloads/day"],
  },
  {
    name: "SILVER",
    price: "₹199",
    popular: true,
    icon: "🥈",
    color: "border-blue-500",
    button: "bg-blue-600 hover:bg-blue-500",
    features: ["10 min watch limit", "20 downloads/day"],
  },
  {
    name: "GOLD",
    price: "₹299",
    icon: "🥇",
    color: "border-yellow-500",
    button: "bg-yellow-500 hover:bg-yellow-400 text-black",
    features: ["Unlimited watch", "Unlimited downloads"],
  },
];

export default function PremiumPage() {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      const existing = document.getElementById("razorpay-script");

      if (existing) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const upgradePlan = async (plan: string) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user.email) {
      toast.error("Please Login First");
      return;
    }

    if (plan === "FREE") {
      localStorage.setItem("plan", "FREE");
      window.dispatchEvent(new Event("planChanged"));
      toast.success("Switched to FREE Plan");
      return;
    }

    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Failed to load Razorpay");
      return;
    }

    setLoading(true);

    try {
      const amount = plan === "BRONZE" ? 99 : plan === "SILVER" ? 199 : 299;

      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }),
        },
      );

      const orderData = await orderRes.json();

      const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: orderData.order.amount,
  currency: "INR",
  name: "StreamLink",
  description: `${plan} Subscription`,
  order_id: orderData.order.id,

  handler: async (response: any) => {
    try {
      const updateRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/update-plan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            plan,
            paymentId: response.razorpay_payment_id,
          }),
        }
      );

      const updateData = await updateRes.json();

      if (!updateData.success) {
        toast.error("Plan upgrade failed");
        return;
      }

      localStorage.setItem("plan", plan);
      window.dispatchEvent(new Event("planChanged"));

      const invoiceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/email/invoice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            plan,
            amount,
          }),
        }
      );

      const invoiceData = await invoiceRes.json();

      if (!invoiceRes.ok) {
        console.log(invoiceData);
        toast.error("Invoice email failed");
      } else {
        toast.success("Invoice email sent");
      }

      toast.success(`${plan} Activated Successfully`);
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  },

  prefill: {
    name: user.username,
    email: user.email,
  },

  theme: {
    color: "#2563eb",
  },
};

const paymentObject = new (window as any).Razorpay(options);
paymentObject.open();
} catch (err) {
  console.log(err);
  toast.error("Payment Failed");
} finally {
  setLoading(false);
}
  };
  return (
    <AuthGuard>
      <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-14">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
            Upgrade Your Experience
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            Unlock more watching time, downloads and premium features.
          </p>
        </div>

        {loading && (
          <div className="max-w-md mx-auto mb-10 bg-blue-600 rounded-xl p-4 text-center font-semibold animate-pulse">
            Processing Payment...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
             className={`
relative
w-full
max-w-[320px]
mx-auto
rounded-3xl
border
${plan.color}
bg-slate-900
shadow-xl
transition-all
duration-300
hover:-translate-y-2
hover:shadow-2xl
overflow-hidden
`}
            >
              {plan.popular && (
               <div className="absolute top-0 right-0 bg-blue-600 px-3 py-1 rounded-bl-2xl text-xs sm:text-sm font-bold">
                  ⭐ MOST POPULAR
                </div>
              )}

              <div className="p-8">
               <div className="text-5xl sm:text-6xl mb-5">{plan.icon}</div>

                <h2 className="text-2xl sm:text-3xl font-bold">{plan.name}</h2>

                <p className="text-3xl sm:text-4xl font-extrabold my-6">
                  {plan.price}

                  <span className="text-base text-gray-400">/month</span>
                </p>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <div className="text-green-500">✔</div>

                      <p>{feature}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => upgradePlan(plan.name)}
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 ${plan.button}`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Compare Plans</h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-700">
            <table className="w-full min-w-[650px]">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-4 text-left">Features</th>

                  <th className="p-4">FREE</th>

                  <th className="p-4">BRONZE</th>

                  <th className="p-4">SILVER</th>

                  <th className="p-4">GOLD</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-700">
                  <td className="p-4">Watch Time</td>

                  <td className="text-center">5 min</td>

                  <td className="text-center">7 min</td>

                  <td className="text-center">10 min</td>

                  <td className="text-center">Unlimited</td>
                </tr>

                <tr className="border-b border-slate-700">
                  <td className="p-4">Downloads</td>

                  <td className="text-center">1/day</td>

                  <td className="text-center">5/day</td>

                  <td className="text-center">20/day</td>

                  <td className="text-center">Unlimited</td>
                </tr>

                <tr>
                  <td className="p-4">Invoice Email</td>

                  <td className="text-center">❌</td>

                  <td className="text-center">✔</td>

                  <td className="text-center">✔</td>

                  <td className="text-center">✔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthGuard>
  );

}
