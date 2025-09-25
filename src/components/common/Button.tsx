import type { FC, ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`py-3 px-6 bg-purple-700 text-white font-semibold rounded-[10px] cursor-pointer hover:bg-purple-800 transition duration-200 ease-in-out shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
