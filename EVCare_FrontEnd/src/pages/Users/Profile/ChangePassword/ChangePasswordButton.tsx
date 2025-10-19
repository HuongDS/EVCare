import React from "react";

interface Props {
  onClick: () => void;
}

export const ChangePasswordButton: React.FC<Props> = ({ onClick }) => {
  return (
    <button className="edit-btn" onClick={onClick}>
      <span>Change Password</span>
    </button>
  );
};
