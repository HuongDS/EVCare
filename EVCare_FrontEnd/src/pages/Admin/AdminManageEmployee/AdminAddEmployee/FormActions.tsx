import React, { type FormEvent } from "react";

interface FormActionsProps {
  onSubmit: (e: FormEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onSubmit, onCancel }) => (
  <div className="form-actions">
    <button type="submit" className="submit-btn" onClick={onSubmit}>
      Add Employee
    </button>
    <button type="button" className="cancel-btn" onClick={onCancel}>
      Cancel
    </button>
  </div>
);

export default FormActions;
