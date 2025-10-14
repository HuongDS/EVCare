import React from "react";

interface BanModalProps {
  visible: boolean;
  userName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const BanModal: React.FC<BanModalProps> = ({ visible, userName, onCancel, onConfirm }) => {
  if (!visible) return null;

  return (
    <div className={`modal ${visible ? "active" : ""}`} onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Confirm Ban User</h3>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to ban this user? They will no longer be able to access their account or make
            appointments.
          </p>
          <p style={{ marginTop: 10 }}>
            <strong>{userName}</strong>
          </p>
        </div>
        <div className="modal-buttons">
          <button className="action-btn cancel-modal-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="action-btn confirm-btn" onClick={onConfirm}>
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal;
