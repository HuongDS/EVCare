import React from "react";

interface TechnicianFieldsProps {
  show: boolean;
  expYear: number;
  handleChange: (e: number) => void;
}

const TechnicianFields: React.FC<TechnicianFieldsProps> = ({ show, expYear, handleChange }) => {
  if (!show) return null;

  return (
    <div className="technician-fields show">
      <div className="section-title">Technician Details</div>
      <div className="info-note"> Additional information required for technician role</div>
      <div className="form-group">
        <label className="form-label">
          Years of Experience<span className="required">*</span>
        </label>
        <input
          type="number"
          className="form-input"
          name="expYear"
          value={expYear}
          onChange={(e) => handleChange(Number(e.target.value))}
          min="0"
          max="50"
          required
        />
      </div>
    </div>
  );
};

export default TechnicianFields;
