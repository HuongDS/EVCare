import React, { useState, useEffect } from "react";
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalButton,
  LoadingSpinner,
} from "../AdminService&Parts/AdminService/Admin_Service.styled";
import { FaTimes, FaSave } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import VehicleCategoryFormFields from "./VehicleCategoryFormFields";
import type { VehicleCategoryCreateDto } from "../../../models/VehicleModels/VehicleCategoryCreateDto";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { getDetailVehicleCategory, updateVehicleCategory } from "../../../services/vehicleServicesApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemToEdit: VehicleCategoryViewDto | null;
}

export default function VehicleCategoryEditModal({ isOpen, onClose, onSuccess, itemToEdit }: Props) {
  const [formData, setFormData] = useState<VehicleCategoryCreateDto>({
    name: "",
    model3DUrl: "",
    partCategoryIds: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notification = useNotification();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (!itemToEdit) return;
      const response = await getDetailVehicleCategory(itemToEdit?.id);
      const tmp = response.data;
      if (tmp != null) {
        setFormData({
          name: tmp.name,
          model3DUrl: tmp.model3DUrl,
          partCategoryIds: tmp.partCategoryNames.map((a) => a.id),
        });
      }
    } catch (error) {
      notification.error({ message: "error", description: (error as Error).message });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (itemToEdit && isOpen) {
      fetchData();
    }
  }, [itemToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemToEdit) return;

    if (!formData.model3DUrl) {
      notification.warning({ message: "Warning", description: "Please process the 3D model link first." });
      return;
    }
    if (formData.partCategoryIds.length === 0) {
      notification.warning({ message: "Warning", description: "Please select at least one part category." });
      return;
    }

    if (formData.name.trim().length <= 0) {
      notification.warning({ message: "Warning", description: "Please input name." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateVehicleCategory(itemToEdit.id, formData);
      notification.success({ message: "Success", description: response.message });
      onSuccess();
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsSubmitting(false);
  };

  return (
    <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContainer
        as="form"
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>Edit Vehicle Category</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose}>
            <FaTimes />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          {isLoading ? (
            <div style={{ minHeight: "300px", display: "grid", placeItems: "center" }}>
              <SpinnerComponent />
            </div>
          ) : (
            <VehicleCategoryFormFields formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} />
          )}
        </ModalBody>

        <ModalFooter>
          <ModalButton type="button" $isConfirm={false} onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" $isConfirm={true} disabled={isSubmitting || isLoading}>
            {isSubmitting ? <LoadingSpinner /> : <FaSave />}
            Save Changes
          </ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
}
