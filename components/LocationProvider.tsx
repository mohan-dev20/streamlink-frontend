"use client";

import { useEffect } from "react";

export default function LocationProvider() {
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            "";

          const state = data.address.state || "";

          localStorage.setItem("city", city);
          localStorage.setItem("state", state);

          console.log("GPS Location:", city, state);
        } catch (err) {
          console.log(err);
        }
      },

      async (error) => {
        console.log("GPS Error:", error);

        try {
          // Fallback using IP Address
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();

          localStorage.setItem("city", data.city || "");
          localStorage.setItem("state", data.region || "");

          console.log("IP Location:", data.city, data.region);
        } catch (err) {
          console.log(err);

          // Final fallback
          localStorage.setItem("city", "Bengaluru");
          localStorage.setItem("state", "Karnataka");

          console.log("Using default location");
        }
      }
    );
  }, []);

  return null;
}