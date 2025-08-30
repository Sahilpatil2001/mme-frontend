import type { FC, ReactNode } from "react";
import GoogleIcon from "../../assets/google-icon.png";

interface Props {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

const GoogleLoginButton: FC<Props> = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`outline-none cursor-pointer font-medium py-[15px] flex items-center justify-center gap-2 bg-[#030014] rounded-[10px] tracking-wide border border-slate-900 hover:bg-purple-700 transition ${className}`}
    >
      <img src={GoogleIcon} alt="Google" className="w-6 h-6" />
      {children}
    </button>
  );
};

export default GoogleLoginButton;
