import React, { useState } from "react";
import { FormWrapper, FormActions, SubmitButton, LoadingSpinner } from "./Admin_Category.styled";
import { FaSave } from "react-icons/fa";
import { useNotification } from "../../../../context/useNotification";
import type { VehicleCategoryCreateDto } from "../../../../models/VehicleModels/VehicleCategoryCreateDto";
import VehicleCategoryFormFields from "./VehicleCategoryFormFields";
import { createVehicleCategory } from "../../../../services/vehicleServicesApi";

interface Props {
  onAddSuccess: () => void;
}

export default function VehicleCategoryForm({ onAddSuccess }: Props) {
  const [formData, setFormData] = useState<VehicleCategoryCreateDto>({
    name: "",
    model3DUrl: "",
    partCategoryIds: [],
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.model3DUrl) {
      notification.warning({
        message: "Warning",
        description: "Please process the 3D model link first.",
        showProgress: true,
      });
      return;
    }
    if (formData.partCategoryIds.length === 0) {
      notification.warning({
        message: "Warning",
        description: "Please select at least one part category.",
        showProgress: true,
      });
      return;
    }
    if (formData.name.trim().length <= 0) {
      notification.warning({
        message: "Warning",
        description: "Please input name.",
        showProgress: true,
      });
      return;
    }
    if (formData.scaleX <= 0 || formData.scaleY <= 0 || formData.scaleZ <= 0) {
      notification.warning({
        message: "Warning",
        description: "Scale values must be greater than 0.",
        showProgress: true,
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await createVehicleCategory(formData);
      notification.success({
        message: "Success",
        description: response.message,
        showProgress: true,
      });
      onAddSuccess();
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <VehicleCategoryFormFields formData={formData} setFormData={setFormData} isSubmitting={isSubmitting} />
      <FormActions>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner /> : <FaSave />}
          Save Category
        </SubmitButton>
      </FormActions>
    </FormWrapper>
  );
}
