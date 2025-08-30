import { auth } from "../Firebase"; // your Firebase init

const BASE_URL = "http://127.0.0.1:8000";

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user found");
  }

  // ✅ Always refresh token if needed
  const firebaseToken = await user.getIdToken(/* forceRefresh */ true);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${firebaseToken}`,
      ...(options.headers || {}),
    },
  });

  // Handle raw text if server doesn’t return JSON
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
};
