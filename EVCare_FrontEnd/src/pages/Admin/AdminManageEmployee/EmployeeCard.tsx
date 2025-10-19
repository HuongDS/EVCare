import React from "react";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { RoleEnum } from "../../../models/enums";

interface Props {
  emp: EmployeeViewModel;
  onBan: (id: number) => void;
}

const EmployeeCard: React.FC<Props> = ({ emp, onBan }) => {
  return (
    <div className="employee-card">
      <div className="employee-header">
        <img src={emp.avatar} alt={emp.fullName} className="employee-avatar" />
        <div className="employee-basic-info">
          <div className="employee-name-section">
            <div className="employee-name">{emp.fullName}</div>
            <span className={`role-badge role-${emp.role.toLocaleLowerCase()}`}>{emp.role}</span>
            {emp.isBanned && <span className="banned-badge">Banned</span>}
          </div>

          <div className={`status-badge status-${emp.status.toLocaleLowerCase()}`}>
            <span className="status-dot"></span>
            <span>{emp.status}</span>
          </div>
        </div>
      </div>

      <div className="employee-details">
        <div className="detail-item"> {emp.email}</div>
        <div className="detail-item"> {emp.phone ?? "default"}</div>
        <div className="detail-item">
          <span>CCCD:</span> {emp.cccd}
        </div>
      </div>

      {emp.role === RoleEnum.TECHNICIAN && (
        <div className="technician-extra">
          <div className="extra-title">Technician Details</div>
          <div className="experience-badge"> {emp.expYear} years experience</div>
          <div className="skills-list">
            {emp.Skills?.map((s) => (
              <span key={s.id} className="skill-tag">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="employee-actions">
        {emp.isBanned ? (
          <></>
        ) : (
          <button className="action-btn ban-btn" onClick={() => onBan(emp.accountId)}>
            Ban
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeCard;
