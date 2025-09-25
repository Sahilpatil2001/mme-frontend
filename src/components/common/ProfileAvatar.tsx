// components/common/Profile.tsx
import type { FC } from "react";
import type { ProfileProps } from "../../types/ProfileProps";

const ProfileAvatar: FC<ProfileProps> = ({ avatarUrl }) => {
  return (
    <div>
      {/* Avatar */}
      <img src={avatarUrl} className="w-10 h-10 rounded-full object-cover" />
      {/* User Info */}
    </div>
  );
};

export default ProfileAvatar;
