import React, { useState, useEffect } from "react";
import { PasswordField } from "./PasswordField";
import { PasswordStrength } from "./PasswordStrength";
import { PasswordRequirements } from "./PasswordRequirements";
import type { AccountUpdatePasswordDto } from "../../../../models/Accounts/AccountUpdatePasswordDto";
import { useNotification } from "../../../../context/useNotification";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../../constants/messages/Message";
import { updatePassword, verifyOldPassword } from "../../../../services/accountService";
import { PASSWORD_REGEX } from "../../../../constants/regexs/PasswordRegex";
import { useAlert } from "../../../../context/useAlert";
import SpinnerComponent from "../../../../components/SpinnerComponent";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [strength, setStrength] = useState<"weak" | "medium" | "strong" | "">("");
  const [requirements, setRequirements] = useState({
    length: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const req = {
      length: next.length >= 8,
      lowercase: /[a-z]/.test(next),
      number: /[0-9]/.test(next),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(next),
    };
    setRequirements(req);

    const met = Object.values(req).filter(Boolean).length;
    if (met < 2) setStrength("weak");
    else if (met < 4) setStrength("medium");
    else setStrength("strong");
  }, [next]);

  const canSubmit = Object.values(requirements).every(Boolean) && next === confirm && current.length > 0;

  const notification = useNotification();
  const { showAlert } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const data: AccountUpdatePasswordDto = {
      newPassword: next,
      oldPassword: current,
    };

    if (!PASSWORD_REGEX.test(next) || !PASSWORD_REGEX.test(confirm) || !PASSWORD_REGEX.test(current)) {
      showAlert("error", MSG_TITLE.UPDATE_PASSWORD, ERROR_MESSAGE.INVALID_PASSWORD);
      return;
    } else if (next !== confirm) {
      showAlert("error", MSG_TITLE.UPDATE_PASSWORD, ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME);
      return;
    }

    try {
      await verifyOldPassword(data);
      const response = await updatePassword(data);
      if (!response.data) {
        throw new Error(response.message);
      }
      notification.success({
        message: MSG_TITLE.UPDATE_PASSWORD,
        description: response.message,
      });
    } catch (error) {
      notification.error({ message: MSG_TITLE.UPDATE_PASSWORD, description: (error as Error).message });
    } finally {
      //   onClose();
      resetForm();
      setSubmitted(false);
    }
  };

  const resetForm = () => {
    setCurrent("");
    setNext("");
    setConfirm("");
    setStrength("");
    setRequirements({
      length: false,
      lowercase: false,
      number: false,
      special: false,
    });
    setSubmitted(false);
  };

  //   if (!open) return null;

  return (
    <div className={`modal ${open ? "active" : ""}`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <div className="modal-header">
              <h2 className="modal-title">
                <span>Change Password</span>
              </h2>
              <button className="close-btn" onClick={onClose}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <PasswordField
                label="Current Password"
                value={current}
                onChange={setCurrent}
                placeholder="Enter your current password"
                required
              />

              <PasswordField
                label="New Password"
                value={next}
                onChange={setNext}
                placeholder="Enter your new password"
                required
              />

              <PasswordStrength strength={strength} />
              <PasswordRequirements requirements={requirements} />

              <PasswordField
                label="Confirm New Password"
                value={confirm}
                onChange={setConfirm}
                placeholder="Re-enter your new password"
                required
                error={confirm && next !== confirm ? "Passwords do not match" : ""}
              />

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={!canSubmit}>
                  Update Password
                </button>
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </form>
          </>
        ) : (
          <SpinnerComponent />
        )}
      </div>
    </div>
  );
};
