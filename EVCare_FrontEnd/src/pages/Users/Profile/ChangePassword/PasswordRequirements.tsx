import React from "react";

interface PasswordRequirementsProps {
  requirements: Record<string, boolean>;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements }) => {
  return (
    <div className="password-requirements">
      <div className="requirement-title">Password must contain:</div>
      <ul className="requirement-list">
        <li className={`requirement-item ${requirements.length ? "met" : ""}`}>At least 8 characters</li>
        <li className={`requirement-item ${requirements.lowercase ? "met" : ""}`}>One lowercase letter</li>
        <li className={`requirement-item ${requirements.number ? "met" : ""}`}>One number</li>
        <li className={`requirement-item ${requirements.special ? "met" : ""}`}>One special character</li>
      </ul>
    </div>
  );
};
