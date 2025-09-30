// import { useEffect, useState } from "react";
import type { FC } from "react";
// import { auth } from "../Firebase";
// import type { User } from "firebase/auth";
// import AdminSettings from "../components/Dashboard/AdminSettings";
// import { onAuthStateChanged } from "firebase/auth";
import UserProfile from "../components/Dashboard/UserProfile";

const Dashboard: FC = () => {
  // const [userName, setUserName] = useState<string>("");

  // useEffect(() => {
  //   // Listen for auth state changes
  //   const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
  //     if (!user) {
  //       setUserName("");
  //       return;
  //     }

  //     try {
  //       // Force refresh token to get latest
  //       const token = await user.getIdToken(true);

  //       const res = await fetch("http://localhost:8000/api/get-user", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (!res.ok) {
  //         console.error("Failed to fetch user");
  //         return;
  //       }

  //       const data = await res.json();
  //       setUserName(data.firstName);
  //     } catch (err) {
  //       console.error("Error fetching user:", err);
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, []);

  return (
    <div className="flex w-full">
      <div className="py-10 px-10 space-y-8 w-full">
        {/* <h1 className="text-2xl font-semibold">
          {userName ? `Welcome, ${userName} 👋` : "Welcome, user 👋"}
        </h1> */}

        {/* <AdminSettings /> */}
        <UserProfile />
      </div>
    </div>
  );
};

export default Dashboard;
