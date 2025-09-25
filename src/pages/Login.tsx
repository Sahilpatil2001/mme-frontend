import type { FC, ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/common/FormInput";
import Button from "../components/common/Button.tsx";
import { showSuccessToast, showErrorToast } from "../utils/toastHelper.tsx";
import type { LoginDetails } from "../types/auth/Login.ts";
import GoogleLoginButton from "../components/common/GoogleLoginButton";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../Firebase.ts";

const LoginForm: FC = () => {
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const BASE_URL = "http://localhost:8000";

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginDetails.email || !loginDetails.password) {
      showErrorToast("Please fill all fields");
      return;
    }

    try {
      // Step 1: Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginDetails.email,
        loginDetails.password
      );
      const user = userCredential.user;

      // Step 2: Get Firebase ID token
      const firebaseToken = await user.getIdToken(true);

      // Step 3: Send token to backend
      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({ email: loginDetails.email, uid: user.uid }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("token", firebaseToken);
      showSuccessToast("Logged in successfully!");
      navigate("/");
    } catch (err: any) {
      showErrorToast(err.message || "Login failed.");
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    const BASE_URL = "http://localhost:8000";
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const firebaseToken = await user.getIdToken(true);

      const res = await fetch(`${BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Google login failed");

      localStorage.setItem("token", firebaseToken);
      showSuccessToast("Logged in with Google!");
      navigate("/");
    } catch (err: any) {
      showErrorToast(err.message || "Google login failed.");
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

            <div className="flex flex-col gap-10 items-center">
              <Button type="submit" className="w-full px-40 tracking-wide">
                Login
              </Button>

              <p className="text-gray-500">
                Don't have an account?
                <span
                  onClick={() => navigate("/register")}
                  className="text-purple-500 font-medium cursor-pointer ml-2"
                >
                  Register Here
                </span>
              </p>
              <GoogleLoginButton className="px-19" onClick={handleGoogleLogin}>
                Continue with google
              </GoogleLoginButton>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
