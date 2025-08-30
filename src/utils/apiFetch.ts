// utils/apiFetch.ts
import { auth } from "../Firebase";

// ✅ Safely get Firebase token (auto refreshes if expired)
export const getFirebaseToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    return await user.getIdToken(); // auto-refreshes
  } catch (err) {
    console.warn("getIdToken failed, forcing refresh...", err);
    try {
      return await user.getIdToken(true); // force refresh
    } catch (refreshErr) {
      console.error("Token refresh failed:", refreshErr);
      return null;
    }
  }
};

// ✅ API wrapper
export const apiFetch = async (url: string, options: RequestInit = {}) => {
  // Try fresh Firebase token first
  let token = await getFirebaseToken();

  // If no token from Firebase, fallback to localStorage
  if (!token) {
    token = localStorage.getItem("idToken");
  }

  if (!token) {
    throw new Error("No valid Firebase token found. Please login again.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}), // ✅ merge caller headers
    Authorization: `Bearer ${token}`,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // ✅ Handle expired/invalid token at runtime
  if (response.status === 401 && auth.currentUser) {
    console.warn("Token expired. Forcing refresh...");
    const newToken = await auth.currentUser.getIdToken(true);
    if (newToken) {
      localStorage.setItem("idToken", newToken);
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  return response;
};
