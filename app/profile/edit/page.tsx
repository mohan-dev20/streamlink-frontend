"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
const [city, setCity] = useState("");
   const [profilePic, setProfilePic] = useState<File | null>(null);
const [preview, setPreview] = useState("");
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  setUser(storedUser);

  setUsername(storedUser.username || "");

  setEmail(storedUser.email || "");
  setBio(storedUser.bio || "");
setCity(storedUser.city || "");
}, []);
  const saveProfile = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formData = new FormData();

  formData.append("username", username);
  formData.append("bio", bio);
formData.append("city", city);

  if (profilePic) {
    formData.append("profilePic", profilePic);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/update/${user._id}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (data.success) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    toast.success("Profile Updated");

    router.push("/profile");
  } else {
    toast.error(data.message);
  }
};
   

  return (
    <div className="max-w-xl mx-auto mt-10 bg-slate-900 p-8 rounded-2xl">

      <h1 className="text-3xl font-bold mb-8">
        Edit Profile
      </h1>

      <div className="space-y-5">
           <div className="flex flex-col items-center mb-6">

  <img
    src={
      preview ||
      user?.profilePic ||
      "https://placehold.co/150x150"
    }
    className="w-36 h-36 rounded-full object-cover border-4 border-blue-500"
  />

  <input
    type="file"
    accept="image/*"
    className="mt-4"
    onChange={(e) => {
      if (!e.target.files?.length) return;

      setProfilePic(e.target.files[0]);

      setPreview(URL.createObjectURL(e.target.files[0]));
    }}
  />

</div>
        <input
          className="w-full p-3 rounded-xl bg-slate-800"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-xl bg-slate-800"
          value={email}
          disabled
        />
        <textarea
  className="w-full p-3 rounded-xl bg-slate-800"
  placeholder="Bio"
  rows={4}
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>

<input
  className="w-full p-3 rounded-xl bg-slate-800"
  placeholder="City"
  value={city}
  onChange={(e) => setCity(e.target.value)}
/>

        <button
          onClick={saveProfile}
          className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
        >
          Save Changes
        </button>

      </div>

    </div>
  );
}