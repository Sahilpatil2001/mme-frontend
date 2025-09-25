import type { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout: FC = () => {
  return (
    <>
      <Header />
      <div className="w-full flex items-center">
        <div className="w-full flex">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
