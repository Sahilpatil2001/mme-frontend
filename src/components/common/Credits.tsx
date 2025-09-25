import type { FC } from "react";
import { Zap } from "lucide-react";
import type { CreditProps } from "../../types/CreditProps";

const Credits: FC<CreditProps> = ({ count, onClick, size = 24 }) => {
  return (
    <div
      className="flex items-center gap-2 px-6 py-3 border border-gray-600 rounded-[50px] cursor-pointer hover:bg-gray-800 transition"
      onClick={onClick}
    >
      <Zap size={size} className="text-yellow-400" />
      <span className="text-white font-medium">{count} left</span>
    </div>
  );
};

export default Credits;
