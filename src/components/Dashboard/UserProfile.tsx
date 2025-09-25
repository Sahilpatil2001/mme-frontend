import { useEffect, useState } from "react";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import { getAuth } from "firebase/auth";
import { showSuccessToast, showErrorToast } from "../../utils/toastHelper";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    dob: "",
    age: "",
    gender: "",
    email: "",
    isGoogleUser: false,
    photoURL: "",
  });

  const getToken = async (): Promise<string> => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Not logged in");
    return await currentUser.getIdToken();
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.detail);

      setForm(json);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:8000/api/user/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      showSuccessToast("Profile updated!");
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to update profile");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-8 bg-[#030014] rounded-[20px] shadow-md">
      <h2 className="text-xl font-semibold mb-4">User Profile </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <FormInput
          type="text"
          placeholder="Full Name"
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
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
      </div>

      {form.isGoogleUser && (
        <div className="mt-6">
          <p className="text-sm text-gray-400">
            Google User: <strong>{form.email}</strong>
          </p>
          {form.photoURL && (
            <img
              src={form.photoURL}
              alt="Profile"
              className="w-16 h-16 rounded-full mt-2"
            />
          )}
        </div>
      )}

      <Button
        onClick={handleUpdate}
        className="mt-6 bg-purple-700 text-white px-6 py-3 rounded hover:bg-purple-800"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default UserProfile;
