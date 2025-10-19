import React from "react";

interface StrengthProps {
  strength: "weak" | "medium" | "strong" | "";
}

export const PasswordStrength: React.FC<StrengthProps> = ({ strength }) => {
  const textMap = {
    weak: "Weak password",
    medium: "Medium password",
    strong: "Strong password",
    "": "",
  };

  return (
    <div className="password-strength">
      <div className="strength-bar">
        <div className={`strength-fill ${strength}`}></div>
      </div>
      <div className={`strength-text ${strength}`}>{textMap[strength]}</div>
    </div>
  );
};
