import React, { useState } from "react";
import type { FullCustomerInfor } from "../../../models/CustomerModels/FullCustomerInfor";
import defaultCar from "../../../assets/EVcar.webp";

interface UserCardProps {
  user: FullCustomerInfor;
  onBan: (id: number) => void;
  setOpenBanModal: ({ visible, id }: { visible: boolean; id?: number }) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onBan, setOpenBanModal }) => {
  const [expanded, setExpanded] = useState(false);

  const visibleVehicles = expanded ? user.vehicles : user.vehicles.slice(0, 1);

  return (
    <>
      <div className={`user-card ${user.banned ? "disabled" : ""}`}>
        {user.banned && <div className="banned-overlay">BANNED</div>}
        <div className="user-header">
          <div className="user-info">
            <div className="user-name">{user.customerName}</div>
            <div className="user-contact">
              <div className="contact-item">
                <span>{user.phoneNumber}</span>
              </div>
              <div className="contact-item">
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <div className="user-actions">
            <button
              className="action-btn ban-btn"
              onClick={() => {
                setOpenBanModal({ visible: true, id: user.accountId });
                onBan(user.accountId);
              }}
            >
              Ban
            </button>
          </div>
        </div>

        <div className="vehicles-section">
          <div className="vehicles-header">
            Vehicles <span className="vehicle-count">{user.vehicles.length}</span>
          </div>
          <div className="vehicles-list">
            {visibleVehicles.map((v) => (
              <div key={v.id} className="vehicle-item">
                <div className="vehicle-info-item">
                  <div className="vehicle-plate">{v.licensePlate}</div>
                  <div className="vehicle-model">{v.categoryName}</div>
                </div>
                <div className="vehicle-img">
                  <img src={v.image && v.image.length !== 0 && v.image != "string" ? v.image : defaultCar} alt="" />
                </div>
              </div>
            ))}
          </div>
          {user.vehicles.length > 1 && (
            <button className="toggle-btn" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Show less ▲" : "Show more ▼"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserCard;
