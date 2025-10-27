import React, { useState, useEffect } from "react";
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  StyledLabel,
  StyledInput,
  ModalFooter,
  ModalButton,
  GenerateButton,
  LoadingSpinner,
  StyledTextArea,
  GeneratingOverlay,
} from "./Admin_Service.styled";
import { FaTimes, FaSave, FaMagic } from "react-icons/fa";
import { useNotification } from "../../../../context/useNotification";
import type { Service } from "../../../../models/ServicesModel/ServiceViewModel";
import type { ServiceCreateDto } from "../../../../models/ServicesModel/ServiceCreateDto";
import type { ServiceCategoryAdminDto } from "../../../../models/ServicesModel/ServiceCategoryAdminDto";
import { StyledSelect } from "../AdminPart/Admin_Part.styled";
import { createService, updateService } from "../../../../services/serviceServicesApi";
import { callGemini } from "../../../../services/geminiServices";
import { AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceToEdit: Service | null;
  serviceCategories: ServiceCategoryAdminDto[];
}

const generateServiceDetails = async (serviceName: string) => {
  if (serviceName.length <= 0) return;

  try {
    const propmt =
      "You are an specailist in vehicle maintenance, a home maintenance and services company. Your task is to generate details for a given service name. Provide a concise, professional description (1-2 sentences) and a realistic estimated duration in hours (e.g., 1.5, 2, 8). Respond only with the requested JSON.";
    const name = "Service name: " + serviceName;
    const result = await callGemini(name, propmt, 3, 1000);
    if (result && result.description && typeof result.duration === "number") {
      return result;
    } else {
      console.error("Failed to generate service details or received invalid data.");
    }
  } catch (error) {
    console.log(error);
  }
};

const ServiceFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, serviceToEdit, serviceCategories }) => {
  const isUpdateMode = !!serviceToEdit;
  const notification = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
    serviceCategoryId: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isUpdateMode && serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        duration: serviceToEdit.duration,
        serviceCategoryId: serviceToEdit.serviceCategoryId,
      });
    } else {
      setFormData({ name: "", description: "", duration: 0, serviceCategoryId: 0 });
    }
  }, [isOpen, isUpdateMode, serviceToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "duration" ? parseFloat(value) || 0 : name === "serviceCategoryId" ? parseInt(value) || 0 : value,
    }));
  };

  const handleGenerateDetails = async () => {
    if (!formData.name.trim()) {
      notification.warning({ message: "Warning", description: "Please enter a service name first." });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateServiceDetails(formData.name.trim());
      setFormData((prev) => ({
        ...prev,
        description: result.description,
        duration: result.duration,
      }));
      notification.success({ message: "Generated", description: "Description and duration populated." });
    } catch (error) {
      console.error("Failed to generate details", error);
      notification.error({ message: "Error", description: "Could not generate details." });
    }
    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.serviceCategoryId === 0) {
        throw new Error("Please select a service category.");
      }

      if (formData.name.trim().length <= 0) {
        throw new Error("Please input a service name category.");
      }

      if (formData.description.trim().length <= 0) {
        throw new Error("Please input a service description.");
      }

      if (formData.duration <= 0) {
        throw new Error("Please input a valid service duration.");
      }

      setIsSubmitting(true);

      let response = null;
      if (isUpdateMode && serviceToEdit) {
        const payload: Service = { id: serviceToEdit.id, ...formData, isDeleted: false };
        response = await updateService(payload);
      } else {
        const payload: ServiceCreateDto = { ...formData };
        response = await createService(payload);
      }
      onSuccess();
      notification.success({ message: "Success", description: response.message });
    } catch (error) {
      console.error("Failed to submit form", error);
      notification.error({ message: "Error", description: (error as Error).message || "Could not save service." });
    }
    setIsSubmitting(false);
  };

  return (
    <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContainer
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} style={{ display: "contents" }}>
          <ModalHeader>
            <ModalTitle>{isUpdateMode ? "Edit Service" : "Add New Service"}</ModalTitle>
            <ModalCloseButton type="button" onClick={onClose}>
              <FaTimes />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <InputGroup>
              <StyledLabel htmlFor="service-name">Service Name</StyledLabel>
              <StyledInput
                id="service-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting || isGenerating}
              />

              <GenerateButton
                type="button"
                onClick={handleGenerateDetails}
                disabled={isSubmitting || isGenerating || !formData.name.trim()}
              >
                {isGenerating ? <LoadingSpinner /> : <FaMagic />}
                Generate Description & Duration
              </GenerateButton>
            </InputGroup>

            <InputGroup>
              <StyledLabel htmlFor="service-category">Category</StyledLabel>
              <StyledSelect
                id="service-category"
                name="serviceCategoryId"
                value={serviceToEdit?.serviceCategoryId ?? formData.serviceCategoryId}
                onChange={handleInputChange}
                required
                disabled={isSubmitting || isGenerating}
              >
                <option value={0} disabled>
                  Select Service Category
                </option>
                {serviceCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </StyledSelect>
            </InputGroup>

            <InputGroup>
              <AnimatePresence>
                {isGenerating && (
                  <GeneratingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LoadingSpinner />
                  </GeneratingOverlay>
                )}
              </AnimatePresence>
              <StyledLabel htmlFor="service-description">Description</StyledLabel>
              <StyledTextArea
                id="service-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting || isGenerating}
                rows={6}
              />
            </InputGroup>

            <InputGroup>
              <AnimatePresence>
                {isGenerating && (
                  <GeneratingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <LoadingSpinner />
                  </GeneratingOverlay>
                )}
              </AnimatePresence>
              <StyledLabel htmlFor="service-duration">Estimated Duration (Hours)</StyledLabel>
              <StyledInput
                id="service-duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min={0.1}
                step={0.1}
                disabled={isSubmitting || isGenerating}
              />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <ModalButton type="button" $isConfirm={false} onClick={onClose} disabled={isSubmitting}>
              Cancel
            </ModalButton>
            <ModalButton type="submit" $isConfirm={true} disabled={isSubmitting || isGenerating}>
              {isSubmitting ? <LoadingSpinner /> : <FaSave />}
              {isUpdateMode ? "Save Changes" : "Add Service"}
            </ModalButton>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default ServiceFormModal;
