import { notification } from "antd";
import { useRef, useState } from "react";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../constants/messages/Message";
import { PHONE_NUMBER_REGEX } from "../../../constants/regexs/PhoneNumberRegex";

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

  const firstName0 = useRef(defaultValues.firstName);
  const lastName0 = useRef(defaultValues.lastName);
  const phone0 = useRef(defaultValues.phone);

  const onToggleEdit = () => {
    setEditMode(true);
  };

  const onCancel = () => {
    setEditMode(false);
    setFirstName(firstName0.current);
    setLastName(lastName0.current);
    setPhone(phone0.current);
  };

  const onSaveClick = () => {
    onSave({ firstName, lastName, phone });
    if (firstName == null || lastName == null || firstName.trim().length == 0 || lastName.trim().length == 0) {
      notification.error({
        message: MSG_TITLE.UPDATE_PROFILE,
        description: ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED,
        showProgress: true,
      });
      return;
    }
    if (!PHONE_NUMBER_REGEX.test(phone)) {
      notification.error({
        message: MSG_TITLE.UPDATE_PROFILE,
        description: ERROR_MESSAGE.INVALID_PHONE,
        showProgress: true,
      });
      return;
    }
    firstName0.current = firstName;
    lastName0.current = lastName;
    phone0.current = phone;
    setEditMode(false);
    notification.success({
      message: MSG_TITLE.UPDATE_PROFILE,
      description: "Changes saved successfully!",
      showProgress: true,
    });
  };

  return (
    <>
      <div className="info-grid">
        <div className="info-field">
          <label>First Name</label>
          <input type="text" value={firstName} disabled={!editMode} onChange={(e) => setFirstName(e.target.value)} />
        </div>

        <div className="info-field">
          <label>Last Name</label>
          <input type="text" value={lastName} disabled={!editMode} onChange={(e) => setLastName(e.target.value)} />
        </div>

        <div className="info-field">
          <label>Email</label>
          <input type="email" value={defaultValues.email} disabled />
        </div>

        <div className="info-field">
          <label>Phone Number</label>
          <input type="tel" value={phone} disabled={!editMode} onChange={(e) => setPhone(e.target.value)} />
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
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </>
        )}
      </div>
    </>
  );
}
