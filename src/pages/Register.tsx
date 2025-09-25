import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper.tsx";
import type { UserDetails } from "../types/auth/Register.ts";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Firebase.ts"; // your Firebase config
import GoogleLoginButton from "../components/common/GoogleLoginButton.tsx";

const Register: FC = () => {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const BASE_URL = "http://localhost:8000";

    // ✅ Check if fields are empty (moved to top to prevent Firebase call if invalid)
    if (
      !userDetails.firstName ||
      !userDetails.lastName ||
      !userDetails.email ||
      !userDetails.password ||
      !userDetails.dob ||
      !userDetails.gender
    ) {
      showErrorToast("Please fill all fields");
      return;
    }

    try {
      // ✅ Step 1: Register user in Firebase
      const firebaseUser = await createUserWithEmailAndPassword(
        auth,
        userDetails.email,
        userDetails.password
      );

      const user = firebaseUser.user;
      console.log(user);
      const firebaseToken = await user.getIdToken(true); // optional if backend uses token

      // ✅ Step 2: Call your backend API
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`, // optional
        },
        body: JSON.stringify({
          ...userDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("API response:", data);
      showSuccessToast("🎉 Registered successfully!");
      navigate("/login");
      console.log("Form submitted", userDetails);

      // reset form
      setUserDetails({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        gender: "",
      });
    } catch (error: any) {
      showErrorToast(error.message || "Something went wrong!");
      console.error("Error during registration:", error.message);
    }
  };

  const handleGoogleRegister = async () => {
    const BASE_URL = "http://localhost:8000";
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebaseToken = await user.getIdToken(true);
      const displayName = user.displayName || "";
      const firstName = displayName.split(" ")[0];

      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          firstName,
          photoURL: user.photoURL,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Google registration failed");

      localStorage.setItem("token", firebaseToken);
      showSuccessToast("Registered with Google!");
      navigate("/login");
    } catch (error: any) {
      console.error("Google register error:", error.message);
      showErrorToast(error.message || "Google sign-up failed.");
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={formHandle}
        className="w-full max-w-3xl bg-[#030014] p-8 rounded-2xl shadow-lg flex flex-col items-center gap-8"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold text-center text-white mb-6">
          Create Your Account
        </h1>

        {/* First Name & Last Name */}
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
          <FormInput
            onChange={handleChange}
            placeholder="Enter your First Name"
            type="text"
            name="firstName"
            value={userDetails.firstName}
            className="flex-1"
          />
          <FormInput
            onChange={handleChange}
            placeholder="Enter Your Last Name"
            type="text"
            name="lastName"
            value={userDetails.lastName}
            className="flex-1"
          />
        </div>

        {/* Email & Password */}
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
          <FormInput
            onChange={handleChange}
            placeholder="Enter Your Email"
            type="email"
            name="email"
            value={userDetails.email}
            className="flex-1"
          />
          <FormInput
            onChange={handleChange}
            placeholder="Enter Your Password"
            type="password"
            name="password"
            value={userDetails.password}
            className="flex-1"
          />
        </div>

        {/* DOB & Gender */}
        <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-8">
          <FormInput
            onChange={handleChange}
            placeholder="Date Of Birth"
            type="date"
            name="dob"
            value={userDetails.dob}
            className="flex-1"
          />
          <select
            onChange={handleChange}
            name="gender"
            value={userDetails.gender}
            className="flex-1 border border-[#fff9] py-3 px-4 rounded-lg outline-none bg-[#030014] text-white"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Register Button & Google Sign Up */}
        <div className="flex flex-col w-full gap-5 items-center mt-4">
          <Button type="submit" className="px-40 tracking-wide">
            Register
          </Button>

          <h2 className="text-center text-xl font-medium text-gray-300">OR</h2>

          <GoogleLoginButton
            className="w-full sm:w-1/2 mt-4 py-3 flex items-center justify-center rounded-lg text-white font-medium transition"
            onClick={handleGoogleRegister}
          >
            Sign up with Google
          </GoogleLoginButton>

          <p className="text-center text-gray-400 text-sm sm:text-base mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-500 font-medium ml-1">
              Login
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default Register;
