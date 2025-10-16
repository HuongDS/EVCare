import React from "react";
import { RoleEnum } from "../../../../models/enums";

interface RoleSelectorProps {
  selectedRole: RoleEnum;
  setSelectedRole: (role: RoleEnum) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, setSelectedRole }) => {
  const handleSelect = (role: RoleEnum) => {
    setSelectedRole(role);
  };

  return (
    <div className="form-section">
      <div className="section-title">
        Employee Role<span className="required">*</span>
      </div>

      <div className="role-cards">
        <div
          className={`role-card ${selectedRole === RoleEnum.STAFF ? "selected" : ""}`}
          onClick={() => handleSelect(RoleEnum.STAFF)}
        >
          <div className="role-name">Staff</div>
          <div className="role-description">Customer service & admin</div>
        </div>

        <div
          className={`role-card ${selectedRole === RoleEnum.TECHNICIAN ? "selected" : ""}`}
          onClick={() => handleSelect(RoleEnum.TECHNICIAN)}
        >
          <div className="role-name">Technician</div>
          <div className="role-description">Service & repair specialist</div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
