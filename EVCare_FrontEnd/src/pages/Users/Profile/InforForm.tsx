import { useRef, useState } from "react";

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
    firstName0.current = firstName;
    lastName0.current = lastName;
    phone0.current = phone;
    setEditMode(false);
    alert("Changes saved successfully!");
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
