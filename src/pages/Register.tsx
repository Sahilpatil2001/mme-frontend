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
      navigate("/");
    } catch (error: any) {
      console.error("Google register error:", error.message);
      showErrorToast(error.message || "Google sign-up failed.");
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
            <GoogleLoginButton className="px-15" onClick={handleGoogleRegister}>
              Sign up with google
            </GoogleLoginButton>
            <div className="mt-4 text-center text-md text-gray-500 tracking-wide">
              Already have an account ?
              <Link to="/login" className="text-purple-600 font-medium ml-2">
                Login
              </Link>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Register;
