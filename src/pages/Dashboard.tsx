import { useEffect, useState } from "react";
import type { FC } from "react";
import AdminSettings from "../components/Dashboard/AdminSettings";
import { auth } from "../Firebase";
// import UserProfile from "../components/Dashboard/UserProfile";

const Dashboard: FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // ✅ Force refresh to ensure token is valid
        const token = await user.getIdToken(true);

        const res = await fetch("http://localhost:8000/api/get-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch user");
          return;
        }

        const data = await res.json();
        console.log(data.firstName);
        setUserName(data.firstName);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="py-10 px-10 space-y-8 w-full">
        <h1 className="text-2xl font-semibold">
          {userName ? `Welcome, ${userName} 👋` : "Welcome"}
        </h1>

        <AdminSettings />
      </div>
    </div>
  );
};

export default Dashboard;
