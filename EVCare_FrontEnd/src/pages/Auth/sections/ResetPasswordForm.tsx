import React, { useState } from "react";
import { ONE_NUMBER_REGEX } from "../../../constants/regexs/NumberRegex";
import { FieldGroup, FormWrapper, SubmitBtn } from "../Authentication.styled";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { Form } from "react-bootstrap";

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

  return (
    <FormWrapper>
      <FieldGroup>
        <Form.Label htmlFor="newPassword" style={{ fontWeight: 600 }}>
          New Password
        </Form.Label>
        <Form.Control
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleInputChange}
          disabled={disable}
          placeholder="Input new password"
        />
      </FieldGroup>
      <FieldGroup>
        <Form.Label htmlFor="confirmNewPassword" style={{ fontWeight: 600 }}>
          Confirm New Password
        </Form.Label>
        <Form.Control
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleInputChange}
          disabled={disable}
          placeholder="Input new password"
        />
      </FieldGroup>
      <FieldGroup>
        <Form.Label style={{ fontWeight: 600 }}>OTP Code (6 digits)</Form.Label>
        <p style={{ margin: "5px 0 10px 0", color: "#6b7280", fontSize: "0.9rem" }}>
          Enter the 6-digit OTP sent to your email:
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Form.Control
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={1}
                style={{
                  width: "45px",
                  height: "45px",
                  textAlign: "center",
                  fontSize: "1.5rem",
                  padding: 0,
                }}
                value={otp[i]}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                disabled={disable}
              />
            ))}
        </div>
      </FieldGroup>
      {disable ? (
        <SpinnerComponent />
      ) : (
        <SubmitBtn type="button" onClick={handleFormSubmit}>
          Confirm New Password
        </SubmitBtn>
      )}
    </FormWrapper>
  );
}
