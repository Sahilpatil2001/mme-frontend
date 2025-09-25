// Components/Dashboard/UserProfile.tsx
import { useEffect, useState } from "react";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastHelper";
import type { User } from "firebase/auth";
import type { UserProfileProps } from "../../types/UserProfileProps";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [form, setForm] = useState<UserProfileProps>({
    name: "",
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    email: "",
    isGoogleUser: false,
    photoURL: "",
  });

  // Watch for Firebase auth state
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        fetchUser(user);
      } else {
        setFirebaseUser(null);
        setLoading(false);
        showErrorToast("User not logged in");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user details from backend
  const fetchUser = async (user: User) => {
    try {
      const token = await user.getIdToken(true);
      const res = await fetch("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.detail || "Failed to fetch user");

      setForm({
        name: json.name || "",
        fullName: json.fullName || "",
        dob: json.dob || "",
        age: json.age || "",
        gender: json.gender || "",
        email: json.email || "",
        isGoogleUser: json.isGoogleUser || false,
        photoURL: json.photoURL || "",
      });
    } catch (err) {
      console.error("❌ Failed to fetch user", err);
      showErrorToast("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const handleUpdate = async () => {
    if (!firebaseUser) {
      showErrorToast("No user found. Please log in again.");
      return;
    }

    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await fetch("http://localhost:8000/api/user/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile");

      showSuccessToast("Profile updated!");
    } catch (err) {
      console.error("❌ Update error:", err);
      showErrorToast("Failed to update profile");
    }
  };

  if (loading) return <p className="text-white">Loading user data...</p>;

  return (
    <div className="p-8 bg-[#030014] rounded-[20px] shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        {form.photoURL ? (
          <img
            src={form.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold text-xl">
            {form.name?.charAt(0) || "U"}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-white">
          Welcome, {form.name || form.fullName || "User"} 👋
        </h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormInput
          type="text"
          placeholder="Last Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <FormInput
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <FormInput
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          className="w-full p-2 border rounded border-slate-800 bg-slate-950 text-white"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <FormInput
          type="email"
          value={form.email}
          disabled
          onChange={() => {}}
        />
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleUpdate}
          className="bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
