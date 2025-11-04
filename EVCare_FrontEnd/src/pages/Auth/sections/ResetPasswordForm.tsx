import React, { useState } from "react";
import { ONE_NUMBER_REGEX } from "../../../constants/regexs/NumberRegex";
import { FormWrapperOTP, SubmitBtn } from "../Authentication.styled";
import SpinnerComponent from "../../../components/SpinnerComponent";

type FormDataResetPassword = {
  newPassword: string;
  confirmNewPassword: string;
};

type ResetPasswordFormProps = {
  handleSubmit: (formData: FormDataResetPassword, otp: string) => void;
  disable: boolean;
};

export default function ResetPasswordForm({ handleSubmit, disable }: ResetPasswordFormProps) {
  const [formData, setFormDataResetPassword] = useState<FormDataResetPassword>({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDataResetPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }

    if (val === "" || ONE_NUMBER_REGEX.test(val)) {
      setOtp((prev) => {
        const next = [...prev];
        next[i] = val;
        return next;
      });
    }
  };

  const handleFormSubmit = () => {
    const finalOtp = otp.join("");
    handleSubmit(formData, finalOtp);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "50px",
    fontSize: "1.2rem",
    border: "1px solid #ccc",
    padding: "0 10px",
    marginBottom: "15px",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  return (
    <FormWrapperOTP>
      <label htmlFor="newPassword" style={{ width: "100%", textAlign: "left", fontWeight: 500 }}>
        New Password
      </label>
      <input
        id="newPassword"
        name="newPassword"
        type="password"
        style={inputStyle}
        value={formData.newPassword}
        onChange={handleInputChange}
        disabled={disable}
        placeholder="Input new password"
      />

      <label htmlFor="confirmNewPassword" style={{ width: "100%", textAlign: "left", fontWeight: 500 }}>
        Confirm New Password
      </label>
      <input
        id="confirmNewPassword"
        name="confirmNewPassword"
        type="password"
        style={inputStyle}
        value={formData.confirmNewPassword}
        onChange={handleInputChange}
        disabled={disable}
        placeholder="Input confirm new password"
      />

      <label style={{ width: "100%", textAlign: "left", fontWeight: 500, marginTop: "10px" }}>
        OTP Code (6 digits)
      </label>
      <p style={{ alignSelf: "flex-start", margin: "5px 0 10px 0" }}>Enter the 6-digit OTP sent to your email:</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <input
              key={i}
              type="text"
              inputMode="numeric"
              maxLength={1}
              style={{
                width: "45px",
                height: "45px",
                textAlign: "center",
                fontSize: "1.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
              value={otp[i]}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              disabled={disable}
            />
          ))}
      </div>

      {disable ? (
        <SpinnerComponent />
      ) : (
        <SubmitBtn type="button" onClick={handleFormSubmit}>
          Confirm
        </SubmitBtn>
      )}
    </FormWrapperOTP>
  );
}
