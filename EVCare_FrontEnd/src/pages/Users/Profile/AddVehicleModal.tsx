import React, { useState } from "react";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import UploadImage from "../../../components/UploadFields/uploadImage";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (v: Omit<VehicleViewDto, "id">) => void;
}

const models = [
  "Tesla Model 3",
  "Tesla Model S",
  "Tesla Model X",
  "Tesla Model Y",
  "BMW i4",
  "BMW iX",
  "Mercedes EQS",
  "Audi e-tron",
  "Porsche Taycan",
  "VinFast VF8",
  "VinFast VF9",
];

export default function AddVehicleModal({ open, onClose, onAdd }: Props) {
  const [categoryName, setCategoryName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  // const fileRef = useRef<HTMLInputElement | null>(null);
  const [categoryId, setCategoryId] = useState(0);

  // const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const f = e.target.files?.[0];
  //   if (!f) {
  //     setPreview(null);
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onload = (ev) => setPreview(String(ev.target?.result || ""));
  //   reader.readAsDataURL(f);
  // };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<VehicleViewDto, "id"> = {
      categoryName,
      licensePlate,
      image: preview || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop",
      cateId: categoryId,
    };

    onAdd(payload);
    // reset
    setCategoryName("");
    setLicensePlate("");
    setCategoryId(0);
    setPreview(null);
    // if (fileRef.current) fileRef.current.value = "";
  };

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`modal ${open ? "active" : ""}`} onClick={onBackdropClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <h2 className="modal-title">Add New Vehicle</h2>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Vehicle Model</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
              <option value="">Select a model</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>License Plate</label>
            <input
              required
              type="text"
              placeholder="e.g., 29A-12345"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Vehicle Photo</label>
            <UploadImage handleFileSubmit={(url) => setPreview(url)} />
            {preview && (
              <img
                src={preview}
                alt="Vehicle"
                className="preview-image"
                style={{ marginTop: "10px", width: "200px", borderRadius: "8px" }}
              />
            )}
          </div>

          <div className="modal-buttons">
            <button type="submit" className="edit-btn">
              Add Vehicle
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
