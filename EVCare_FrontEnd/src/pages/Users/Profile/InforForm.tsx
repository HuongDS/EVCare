// import { notification } from "antd";
import { useEffect, useRef, useState } from "react";
import { ERROR_MESSAGE, MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import { PHONE_NUMBER_REGEX } from "../../../constants/regexs/PhoneNumberRegex";
import { useNotification } from "../../../context/useNotification";
import { useAlert } from "../../../context/useAlert";
import { ChangePassordStyleWrapper } from "./ChangePassword/ChangePassword.styled";
import { ChangePasswordButton } from "./ChangePassword/ChangePasswordButton";
import { ChangePasswordModal } from "./ChangePassword/ChangePasswordModal";

interface Props {
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  onSave: (v: { firstName: string; lastName: string; phone: string }) => void;
}

export default function PersonalInfoForm({ defaultValues, onSave }: Props) {
  const [editMode, setEditMode] = useState(false);

  const [firstName, setFirstName] = useState(defaultValues.firstName);
  const [lastName, setLastName] = useState(defaultValues.lastName);
  const [phone, setPhone] = useState(defaultValues.phone);
  const [openChangePasswordForm, setOpenChangePasswordForm] = useState(false);

  const firstName0 = useRef(defaultValues.firstName);
  const lastName0 = useRef(defaultValues.lastName);
  const phone0 = useRef(defaultValues.phone);

  const notification = useNotification();
  const { showAlert } = useAlert();

  const onToggleEdit = () => {
    setEditMode(true);
  };

  const onCancel = () => {
    setEditMode(false);
    setFirstName(firstName0.current);
    setLastName(lastName0.current);
    setPhone(phone0.current);
  };

  const onSaveClick = async () => {
    if (firstName == null || lastName == null || firstName.trim().length == 0 || lastName.trim().length == 0) {
      showAlert("error", MSG_TITLE.UPDATE_PROFILE, ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED);
      return;
    }
    if (!PHONE_NUMBER_REGEX.test(phone)) {
      showAlert("error", MSG_TITLE.UPDATE_PROFILE, ERROR_MESSAGE.INVALID_PHONE);
      return;
    }
    try {
      await onSave({ firstName, lastName, phone });
      firstName0.current = firstName;
      lastName0.current = lastName;
      phone0.current = phone;
      setEditMode(false);
      notification.success({
        message: MSG_TITLE.UPDATE_PROFILE,
        description: SUCCESS_MESSAGE.UPDATE_ACCOUNT_SUCCESSFULLY,
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: MSG_TITLE.UPDATE_PROFILE,
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  useEffect(() => {
    setFirstName(defaultValues.firstName);
    setLastName(defaultValues.lastName);
    setPhone(defaultValues.phone);

    firstName0.current = defaultValues.firstName;
    lastName0.current = defaultValues.lastName;
    phone0.current = defaultValues.phone;
  }, [defaultValues]);

  return (
    <>
      <div className="info-grid">
        <div className="info-field">
          <label>First Name</label>
          <input
            required={true}
            type="text"
            value={firstName}
            disabled={!editMode}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="info-field">
          <label>Last Name</label>
          <input
            required={true}
            type="text"
            value={lastName}
            disabled={!editMode}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="info-field">
          <label>Email</label>
          <input type="email" value={defaultValues.email} disabled />
        </div>

        <div className="info-field">
          <label>Phone Number</label>
          <input
            required={true}
            type="tel"
            value={phone}
            disabled={!editMode}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        {!editMode ? (
          <button className="edit-btn" onClick={onToggleEdit}>
            Edit Information
          </button>
        ) : (
          <>
            <button className="edit-btn" onClick={onSaveClick}>
              Save Changes
            </button>
            {openChangePasswordForm ? (
              <ChangePassordStyleWrapper>
                <ChangePasswordModal open={openChangePasswordForm} onClose={() => setOpenChangePasswordForm(false)} />
              </ChangePassordStyleWrapper>
            ) : (
              <ChangePasswordButton onClick={() => setOpenChangePasswordForm(true)} />
            )}
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}
