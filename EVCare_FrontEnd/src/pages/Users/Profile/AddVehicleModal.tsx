import React, { useEffect, useState } from "react";
import Select from "react-select";
import { createPortal } from "react-dom";
import UploadImage from "../../../components/UploadFields/uploadImage";
import type { VehicleCreateDto } from "../../../models/VehicleModels/VehicleCreateDto";
import { LICENSE_PLATE_REGEX } from "../../../constants/regexs/LicensePlateRegex";
import { useAlert } from "../../../context/useAlert";
import { ERROR_MESSAGE, MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import { getVehicleCategories } from "../../../services/vehicleServicesApi";
import { handleError } from "../../../utils/errorHandler";
import { useNotification } from "../../../context/useNotification";
import {
  ModalOverlay,
  ModalContent,
  ModalTitle,
  FormGroup,
  ModalButtons,
  SubmitButton,
  CancelButton,
  PreviewImage,
} from "./AddVehicleModal.styled";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (v: VehicleCreateDto) => void;
}

export default function AddVehicleModal({ open, onClose, onAdd }: Props) {
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
      categoryId,
      licensePlate,
      img: preview || "",
    };

    try {
      await onAdd(payload);
      notification.success({
        message: MSG_TITLE.ADD_VEHICLE,
        description: SUCCESS_MESSAGE.ADD_VEHICLE_SUCCESSFULLY,
        showProgress: true,
      });
      setLicensePlate("");
      setCategoryId(0);
      setPreview(null);
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleUploadImage = ({ url }: { url: string }) => {
    setPreview(url);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVehicleCategories();
        if (!response) throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        setListCategories(response.data ?? []);
      } catch (error) {
        handleError(error);
        notification.error({
          message: MSG_TITLE.ADD_VEHICLE,
          description: ERROR_MESSAGE.SOME_THING_WENT_WRONG,
          showProgress: true,
          duration: 3000,
        });
      }
    };
    fetchData();
  }, [notification]);

  if (!open) return null;

  return createPortal(
    <ModalOverlay onClick={onBackdropClick}>
      <ModalContent role="dialog" aria-modal="true">
        <ModalTitle>Add New Vehicle</ModalTitle>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <label>Vehicle Model</label>
            <Select
              options={listCategories.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
              value={
                listCategories.find((m) => m.id === categoryId)
                  ? {
                      value: categoryId,
                      label: listCategories.find((m) => m.id === categoryId)?.name,
                    }
                  : null
              }
              onChange={(selected) => setCategoryId(selected?.value || 0)}
              placeholder="Select a model"
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: state.isFocused ? "#00ad4e" : "#d9d9d9",
                  boxShadow: state.isFocused ? "0 0 0 3px rgba(0,173,78,0.15)" : "none",
                  "&:hover": { borderColor: "#bdbdbd" },
                  borderRadius: 8,
                  padding: "2px 2px",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "rgba(0,173,78,0.1)" : "white",
                  color: "#333",
                }),
              }}
            />
          </FormGroup>

          <FormGroup>
            <label>License Plate</label>
            <input
              required
              type="text"
              placeholder="e.g., 29A12345"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Vehicle Photo</label>
            <UploadImage
              handleFileRemove={() => setPreview(null)}
              imgQuantity={1}
              handleFileSubmit={(url) => handleUploadImage(url)}
            />
            {preview && <PreviewImage src={preview} alt="Vehicle" />}
          </FormGroup>

          <ModalButtons>
            <SubmitButton type="submit">Add Vehicle</SubmitButton>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
          </ModalButtons>
        </form>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
}
