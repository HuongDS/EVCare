import React, { useEffect, useState } from "react";
import UploadImage from "../../../components/UploadFields/uploadImage";
import type { VehicleCreateDto } from "../../../models/VehicleModels/VehicleCreateDto";
import { LICENSE_PLATE_REGEX } from "../../../constants/regexs/LicensePlateRegex";
import { useAlert } from "../../../context/useAlert";
import { ERROR_MESSAGE, MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import { getVehicleCategories } from "../../../services/vehicleServicesApi";
import { handleError } from "../../../utils/errorHandler";
import { useNotification } from "../../../context/useNotification";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (v: VehicleCreateDto) => void;
}

export default function AddVehicleModal({ open, onClose, onAdd }: Props) {
  // const [categoryName, setCategoryName] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState(0);
  const { showAlert } = useAlert();
  const [listCategories, setListCategories] = useState<VehicleCategoryViewDto[]>([]);
  const notification = useNotification();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!LICENSE_PLATE_REGEX.test(licensePlate) || licensePlate.includes("-")) {
      showAlert("error", MSG_TITLE.ADD_VEHICLE, ERROR_MESSAGE.LICENSE_PLATE_WRONG);
      return;
    }
    const payload: VehicleCreateDto = {
      categoryId: categoryId,
      licensePlate: licensePlate,
      img: preview || "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop",
    };

    try {
      await onAdd(payload);
      notification.success({
        message: MSG_TITLE.ADD_VEHICLE,
        description: SUCCESS_MESSAGE.ADD_VEHICLE_SUCCESSFULLY,
      });
    } catch (error) {
      handleError(error);
      showAlert("error", MSG_TITLE.ADD_VEHICLE, (error as Error).message ?? ERROR_MESSAGE.SOME_THING_WENT_WRONG);
    }

    // reset
    setLicensePlate("");
    setCategoryId(0);
    setPreview(null);
  };

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVehicleCategories();
        if (response == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setListCategories(response.data ?? []);
      } catch (error) {
        handleError(error);
        showAlert("error", MSG_TITLE.ADD_VEHICLE, ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    };
    fetchData();
  }, [showAlert]);

  return (
    <div className={`modal ${open ? "active" : ""}`} onClick={onBackdropClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <h2 className="modal-title">Add New Vehicle</h2>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Vehicle Model</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
              <option value="">Select a model</option>
              {listCategories.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>License Plate</label>
            <input
              required
              type="text"
              placeholder="e.g., 29A12345"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Vehicle Photo</label>
            <UploadImage
              handleFileRemove={() => setPreview(null)}
              imgQuantity={1}
              handleFileSubmit={(url) => setPreview(url)}
            />
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
