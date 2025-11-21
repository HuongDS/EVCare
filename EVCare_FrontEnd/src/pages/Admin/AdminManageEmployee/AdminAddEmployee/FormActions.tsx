import React, { type FormEvent } from "react";
import SpinnerComponent from "../../../../components/SpinnerComponent";

interface FormActionsProps {
  onSubmit: (e: FormEvent<HTMLButtonElement>) => void;
  onCancel: () => void;
  isSubmit: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ onSubmit, onCancel, isSubmit }) => (
  <div className="form-actions">
    {isSubmit ? (
      <SpinnerComponent />
    ) : (
      <>
        <button type="submit" className="submit-btn" onClick={onSubmit}>
          Add Employee
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </>
    )}
  </div>
);

export default FormActions;
