import React from "react";
import type { RoleEnum } from "../../../../models/enums";
import UploadImage from "../../../../components/UploadFields/uploadImage";

interface BasicInfoFormProps {
  firstName: string;
  lastName: string;
  CCCD: string;
  password: string;
  confirmPassword: string;
  phone: string;
  email: string;
  selectedRole: RoleEnum;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setCCCD: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setPhone: (v: string) => void;
  setEmail: (v: string) => void;
  setSelectedRole: (v: RoleEnum) => void;
  setAddImage: (v: string) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  firstName,
  lastName,
  CCCD,
  password,
  confirmPassword,
  phone,
  email,
  selectedRole,
  setFirstName,
  setLastName,
  setCCCD,
  setPassword,
  setConfirmPassword,
  setPhone,
  setEmail,
  setSelectedRole,
  setAddImage,
}) => {
  const handleUploadImage = ({ url }: { url: string }) => {
    setAddImage(url);
  };
  return (
    <div className="form-section">
      <div className="section-title">Basic Information</div>

      <div className="form-grid">
        {/* First Name */}
        <div className="form-group">
          <label className="form-label">
            First Name<span className="required">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            className="form-input"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label className="form-label">
            Last Name<span className="required">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            className="form-input"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label className="form-label">
            Email<span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="example@evcare.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label className="form-label">
            Phone Number<span className="required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="form-input"
            placeholder="09 xxxx xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value.trim())}
            required
          />
        </div>

        {/* CCCD */}
        <div className="form-group">
          <label className="form-label">
            CCCD<span className="required">*</span>
          </label>
          <input
            type="text"
            name="CCCD"
            className="form-input"
            placeholder="001234567890"
            value={CCCD}
            onChange={(e) => setCCCD(e.target.value.trim())}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label className="form-label">
            Password<span className="required">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label className="form-label">
            Confirm Password<span className="required">*</span>
          </label>
          <input
            type="password"
            name="Confirm Password"
            className="form-input"
            placeholder="Enter confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value.trim())}
            required
          />
        </div>

        {/* Role */}
        <div className="form-group">
          <label className="form-label">
            Role<span className="required">*</span>
          </label>
          <input
            type="text"
            name="role"
            className="form-input"
            placeholder="Enter role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as RoleEnum)}
            required
            disabled
          />
        </div>

        {/* Image */}
        <div className="form-group">
          <label className="form-label">
            Add Image<span className="required">*</span>
          </label>
          <UploadImage handleFileSubmit={handleUploadImage} imgQuantity={1} />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
