import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://narisetu-j9ac.onrender.com";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir",
  "Ladakh","Chandigarh","Puducherry",
];

export default function ProfilePage() {
  const { currentUser, userProfile, authHeaders, refreshProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [saveErr, setSaveErr] = useState("");

  const [form, setForm] = useState({
    name: userProfile?.name || currentUser?.displayName || "",
    location: userProfile?.location || "",
    state: userProfile?.state || "",
    businessCategory: userProfile?.businessCategory || "",
    phone: userProfile?.phone || "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg("");
    setSaveErr("");
    setIsSaving(true);
    try {
      const headers = await authHeaders();
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update profile.");
      setSaveMsg("Profile updated successfully!");
      setIsEditing(false);
      await refreshProfile();
    } catch (err) {
      setSaveErr(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const avatarSrc =
    currentUser?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      currentUser?.displayName || "NS"
    )}&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed`;

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-navy-800 to-navy-950 p-8 text-white shadow-xl flex items-center gap-6">
        <img
          src={avatarSrc}
          alt="Profile"
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg flex-shrink-0"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.displayName || "NS")}&backgroundColor=e8d5f5,f0e6ff&textColor=7c3aed`;
          }}
        />
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {currentUser?.displayName || userProfile?.name || "Your Profile"}
          </h2>
          <p className="text-slate-300 text-sm mt-1">{currentUser?.email}</p>
          <span className="inline-block mt-2 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {userProfile?.role || "user"}
          </span>
        </div>
      </div>

      {/* Feedback */}
      {saveMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
          ✅ {saveMsg}
        </div>
      )}
      {saveErr && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-semibold flex items-center gap-2">
          ⚠️ {saveErr}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
          {!isEditing && (
            <button
              onClick={() => {
                setForm({
                  name: userProfile?.name || currentUser?.displayName || "",
                  location: userProfile?.location || "",
                  state: userProfile?.state || "",
                  businessCategory: userProfile?.businessCategory || "",
                  phone: userProfile?.phone || "",
                });
                setIsEditing(true);
                setSaveMsg("");
                setSaveErr("");
              }}
              className="text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-xl transition"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location (City)</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Varanasi"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State</label>
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Select state</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Category</label>
              <select
                name="businessCategory"
                value={form.businessCategory}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Not applicable</option>
                <option value="handloom">Handloom & Textiles</option>
                <option value="handicraft">Handicraft</option>
                <option value="food_processing">Food Processing</option>
                <option value="agriculture">Agriculture</option>
                <option value="retail">Retail</option>
                <option value="services">Services</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setSaveErr(""); }}
                className="px-5 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { label: "Full Name", value: userProfile?.name || currentUser?.displayName || "—" },
              { label: "Email", value: currentUser?.email || "—" },
              { label: "Phone", value: userProfile?.phone || "—" },
              { label: "Location", value: userProfile?.location || "—" },
              { label: "State", value: userProfile?.state || "—" },
              { label: "Business Category", value: userProfile?.businessCategory || "—" },
              { label: "Member Since", value: userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
              { label: "Last Login", value: userProfile?.lastLogin ? new Date(userProfile.lastLogin).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-0.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
