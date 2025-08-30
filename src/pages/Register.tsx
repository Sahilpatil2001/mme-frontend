import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import FormInput from "../components/common/FormInput";
import { showErrorToast, showSuccessToast } from "../utils/toastHelper";
import type { UserDetails } from "../types/auth/Register";
import GoogleIcon from "../assets/google-icon.png";

import {
  // createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../Firebase";

const BASE_URL = "http://127.0.0.1:8000";

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

  // ✅ Email/password registration
  const formHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (Object.values(userDetails).some((v) => !v)) {
      return showErrorToast("Please fill all fields");
    }

    try {
      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userDetails, isGoogleUser: false }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || "Registration failed");
      }

      showSuccessToast("🎉 Registered successfully! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error("❌ Registration error:", err);
      showErrorToast(err.message || "Something went wrong!");
    }
  };

  // ✅ Google registration
  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch(`${BASE_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          photoURL: user.photoURL,
          isGoogleUser: true,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message =
          typeof data.detail === "string"
            ? data.detail
            : data.message || "Google registration failed";
        throw new Error(message);
      }

      showSuccessToast("🎉 Registered with Google! Please login.");
      navigate("/login");
    } catch (err: any) {
      console.error("❌ Google registration error:", err);
      showErrorToast(err.message || "Google sign-up failed!");
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={formHandle}
        className="w-full flex justify-center h-screen items-center"
      >
        <div className="w-[60%] flex flex-col justify-center items-center gap-8">
          <h1 className="text-3xl font-medium text-center mb-3">
            Create Your Account
          </h1>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Enter your First name"
              type="text"
              name="firstName"
              value={userDetails.firstName}
              className="w-[40%]"
            />
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Last Name"
              type="text"
              name="lastName"
              value={userDetails.lastName}
              className="w-[40%]"
            />
          </div>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Email"
              type="email"
              name="email"
              value={userDetails.email}
              className="w-[40%]"
            />
            <FormInput
              onChange={handleChange}
              placeholder="Enter Your Password"
              type="password"
              name="password"
              value={userDetails.password}
              className="w-[40%]"
            />
          </div>

          <div className="flex w-full justify-center space-x-8">
            <FormInput
              onChange={handleChange}
              placeholder="Date Of Birth"
              type="date"
              name="dob"
              value={userDetails.dob}
              className="w-[40%]"
            />

            <select
              onChange={handleChange}
              name="gender"
              value={userDetails.gender}
              className="w-[40%] border border-[#fff9] py-4 px-4 rounded-[10px] outline-none indent-1"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male" className="bg-[#030014]">
                Male
              </option>
              <option value="Female" className="bg-[#030014]">
                Female
              </option>
            </select>
          </div>

          <div className="w-full flex flex-col gap-5 items-center">
            <Button type="submit" className="px-31">
              Register
            </Button>
            <h1 className="text-center text-xl font-medium">OR</h1>
            <Button
              type="button"
              onClick={handleGoogleRegister}
              className="px-15 bg-transparent text-white shadow-none border border-slate-800 flex items-center gap-2 hover:bg-[#8200DB]"
            >
              <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
              Sign up with Google
            </Button>
            <p className="mt-2">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="text-purple-700 font-medium cursor-pointer ml-2"
              >
                Login Here
              </span>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Register;
