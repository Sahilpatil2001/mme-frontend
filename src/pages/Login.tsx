// import type { FC, ChangeEvent, FormEvent } from "react";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import FormInput from "../components/common/FormInput";
// import Button from "../components/common/Button";
// import { showSuccessToast, showErrorToast } from "../utils/toastHelper";
// import type { LoginDetails } from "../types/auth/Login";
// import GoogleIcon from "../assets/google-icon.png";

// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { auth } from "../Firebase";

// const BASE_URL = "http://127.0.0.1:8000";

// const LoginForm: FC = () => {
//   const [loginDetails, setLoginDetails] = useState<LoginDetails>({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();

//   const handleLoginChange = (event: ChangeEvent<HTMLInputElement>): void => {
//     const { name, value } = event.target;
//     setLoginDetails((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!loginDetails.email || !loginDetails.password) {
//       return showErrorToast("Please enter both email and password.");
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/api/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: loginDetails.email,
//           password: loginDetails.password,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.detail || data.message || "Login failed");
//       }

//       // ✅ Save backend token & user
//       localStorage.setItem("backendToken", data.backendToken);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       showSuccessToast("✅ Logged in successfully!");
//       navigate("/");
//     } catch (error: any) {
//       console.error("❌ Login error:", error);
//       showErrorToast(error.message || "Something went wrong.");
//     }
//   };

//   // ✅ Google login (Firebase → backend verification)
//   const handleGoogleLogin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       // ✅ Correct: get Firebase ID token
//       const idToken = await user.getIdToken(true);

//       const response = await fetch(`${BASE_URL}/api/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${idToken}`, // backend verifies this
//         },
//         body: JSON.stringify({
//           email: user.email,
//           uid: user.uid,
//           isGoogleUser: true,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.detail || data.message || "Google login failed");
//       }

//       // ✅ Save backend token & user
//       localStorage.setItem("backendToken", data.backendToken);
//       showSuccessToast("✅ Logged in with Google!");
//       navigate("/");
//     } catch (error: any) {
//       console.error("❌ Google login error:", error);
//       showErrorToast(error.message || "Google sign-in failed.");
//     }
//   };
import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button";
import { showSuccessToast, showErrorToast } from "../utils/toastHelper";
import type { LoginDetails } from "../types/auth/Login";
import GoogleIcon from "../assets/google-icon.png";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../Firebase";

const BASE_URL = "http://127.0.0.1:8000";

const LoginForm: FC = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Email/Password Login
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginDetails.email || !loginDetails.password) {
      return showErrorToast("Please enter both email and password.");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );

      const idToken = await userCredential.user.getIdToken(true);

      // ✅ Send token to backend for user sync
      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || data.message || "Login failed");

      // ✅ Store token & user info locally
      localStorage.setItem("idToken", idToken);
      localStorage.setItem("user", JSON.stringify(userCredential.user));

      showSuccessToast("✅ Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      showErrorToast(error.message || "Something went wrong.");
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const idToken = await user.getIdToken(true);

      const response = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`, // backend verifies this
        },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || data.message || "Google login failed");

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("user", JSON.stringify(user));

      showSuccessToast("✅ Logged in with Google!");
      navigate("/");
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      showErrorToast(error.message || "Google sign-in failed.");
    }
  };

  return (
    <section className="w-full">
      <form
        onSubmit={handleLogin}
        className="w-full flex flex-col h-screen justify-center items-center"
      >
        <div className="w-[60%]">
          <h1 className="text-3xl font-medium text-center mb-9">Login</h1>

          <div className="w-full flex flex-col items-center gap-8">
            <FormInput
              onChange={handleLoginChange}
              placeholder="Enter your Email"
              type="email"
              name="email"
              value={loginDetails.email}
              className="w-[40%]"
            />
            <FormInput
              onChange={handleLoginChange}
              placeholder="Enter Your Password"
              type="password"
              name="password"
              value={loginDetails.password}
              className="w-[40%]"
            />

            <div className="flex flex-col gap-5 items-center">
              <Button type="submit" className="w-full px-40">
                Login
              </Button>
              <h1 className="text-center text-xl font-medium">OR</h1>
              <Button
                type="button"
                onClick={handleGoogleLogin}
                className="px-22 bg-transparent text-white shadow-none border border-slate-800 flex items-center gap-2"
              >
                <img src={GoogleIcon} alt="Google" className="w-5 h-5" />
                Sign in with Google
              </Button>
              <h1 className="text-center text-xl font-medium">OR</h1>
              <p>
                Don't have an account?
                <span
                  onClick={() => navigate("/register")}
                  className="text-purple-700 font-medium cursor-pointer ml-2"
                >
                  Register Here
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
