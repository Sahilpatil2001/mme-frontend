import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { showSuccessToast } from "../utils/toastHelper";
import type { NavItemProps } from "../types/NavItemProps";
import Credits from "./common/Credits";
import ProfileAvatar from "./common/ProfileAvatar";
import { Menu, X } from "lucide-react";

const Header: FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    showSuccessToast("🎉 Logged Out successfully!");
    navigate("/login");
  };

  return (
    <header className="w-full h-[120px] flex items-center justify-between px-6 bg-[#030014] text-white sticky top-0 z-50 shadow-md">
      {/* Logo - left */}
      <div className="flex-shrink-0">
        <Link to="/">
          <img
            src="/logo.png"
            alt="MindMuse Echoes Logo"
            className="h-12 w-auto object-contain sm:h-20 md:h-20 lg:h-20"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-1 justify-center">
        <nav className="flex gap-10 items-center">
          <NavItem label="Home" to="/" />
          <NavItem label="My Audios" onClick={() => navigate("/my-audios")} />
          <NavItem label="My Account" onClick={() => navigate("/dashboard")} />
          <NavItem label="Logout" onClick={handleLogout} />
        </nav>
      </div>

      {/* Right: Credits + Profile */}
      <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
        <Credits count={230} onClick={() => console.log("Credits clicked!")} />
        <ProfileAvatar avatarUrl="https://i.pravatar.cc/100?img=5" />
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[120px] left-0 w-full bg-transparent shadow-lg border-t border-slate-900 animate-slideDown backdrop-blur-lg">
          <nav className="flex flex-col gap-6 py-6 px-6 text-lg font-medium">
            <NavItem label="Home" to="/" onClick={() => setMenuOpen(false)} />
            <NavItem
              label="My Audios"
              onClick={() => {
                navigate("/my-audios");
                setMenuOpen(false);
              }}
            />
            <NavItem
              label="My Account"
              onClick={() => {
                navigate("/dashboard");
                setMenuOpen(false);
              }}
            />
            <NavItem
              label="Logout"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            />

            {/* Credits + Profile stacked */}
            <div className="flex flex-col gap-4 pt-6 border-t border-gray-700">
              <Credits
                count={230}
                onClick={() => {
                  console.log("Credits clicked!");
                  setMenuOpen(false);
                }}
              />
              <ProfileAvatar avatarUrl="https://i.pravatar.cc/100?img=5" />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

const NavItem: FC<NavItemProps> = ({ label, to, onClick }) => {
  const content = (
    <div
      className="text-gray-300 hover:text-white cursor-pointer transition-colors"
      onClick={onClick}
    >
      {label}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default Header;
