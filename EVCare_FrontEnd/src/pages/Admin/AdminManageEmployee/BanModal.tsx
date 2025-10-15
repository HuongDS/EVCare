import React from "react";

interface Props {
  isOpen: boolean;
  employeeName?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BanModal: React.FC<Props> = ({ isOpen, employeeName, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Confirm Ban Employee</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to ban this employee? They will no longer be able to access the system.</p>
          <p style={{ marginTop: 10, fontWeight: 600 }}>{employeeName}</p>
        </div>
        <div className="modal-buttons">
          <button className="action-btn cancel-modal-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="action-btn confirm-btn" onClick={onConfirm}>
            Ban Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal;
