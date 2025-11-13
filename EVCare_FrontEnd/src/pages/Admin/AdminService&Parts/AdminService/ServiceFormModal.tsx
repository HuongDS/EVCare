import React, { useState, useEffect, useCallback } from "react";
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
  PartSelectionWrapper,
  PartPillContainer,
  PartPill,
  PartPillRemoveButton,
} from "./Admin_Service.styled";
import { FaTimes, FaSave, FaMagic } from "react-icons/fa";
import { useNotification } from "../../../../context/useNotification";
import type { PartInService, Service } from "../../../../models/ServicesModel/ServiceViewModel";
import type { ServiceCreateDto } from "../../../../models/ServicesModel/ServiceCreateDto";
import type { ServiceCategoryAdminDto } from "../../../../models/ServicesModel/ServiceCategoryAdminDto";
import { StyledSelect } from "../AdminPart/Admin_Part.styled";
import { createService, updateService } from "../../../../services/serviceServicesApi";
import { callGemini } from "../../../../services/geminiServices";
import { AnimatePresence, motion } from "framer-motion";
import { getAllParts02 } from "../../../../services/partApi";
import type { PartDetailDto } from "../../../../models/PartModel/PartModel";
import type { ServiceUpdateDto } from "../../../../models/ServicesModel/ServiceUpdateDto";

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
  const [allParts, setAllParts] = useState<PartDetailDto[]>([]);
  const [selectedParts, setSelectedParts] = useState<PartInService[]>([]);
  const [partToAddId, setPartToAddId] = useState<number>(0);
  const [PageSize, setPageSize] = useState(0);

  const fetchAllParts = useCallback(async () => {
    try {
      let response = await getAllParts02();
      setPageSize(response.totalItems);
      response = await getAllParts02({ PageSize: PageSize !== 0 ? PageSize : response.totalItems });
      setAllParts(response.items);
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
  }, [notification]);

  useEffect(() => {
    if (isOpen) {
      if (isUpdateMode && serviceToEdit) {
        setFormData({
          name: serviceToEdit.name,
          description: serviceToEdit.description,
          duration: serviceToEdit.duration,
          serviceCategoryId: serviceToEdit.serviceCategoryId,
        });
        setSelectedParts(serviceToEdit.parts || []);
        fetchAllParts();
      } else {
        setFormData({
          name: "",
          description: "",
          duration: 0,
          serviceCategoryId: 0,
        });
        setSelectedParts([]);
        setAllParts([]);
        setPartToAddId(0);
        fetchAllParts();
      }
    }
  }, [isOpen, isUpdateMode, serviceToEdit, fetchAllParts]);

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
      notification.warning({
        message: "Warning",
        description: "Please enter a service name first.",
        showProgress: true,
      });
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
      notification.success({
        message: "Generated",
        description: "Description and duration populated.",
        showProgress: true,
      });
    } catch (error) {
      console.error("Failed to generate details", error);
      notification.error({
        message: "Error",
        description: "Could not generate details.",
        showProgress: true,
      });
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
        const payload: ServiceUpdateDto = {
          id: serviceToEdit.id,
          ...formData,
          partsIds: selectedParts.map((p) => p.id),
        };
        response = await updateService(payload);
      } else {
        const payload: ServiceCreateDto = { ...formData, partsIds: selectedParts.map((p) => p.id) };
        response = await createService(payload);
      }
      onSuccess();
      notification.success({
        message: "Success",
        description: response.message,
        showProgress: true,
      });
    } catch (error) {
      console.error("Failed to submit form", error);
      notification.error({
        message: "Error",
        description: (error as Error).message || "Could not save service.",
        showProgress: true,
      });
    }
    setIsSubmitting(false);
  };

  const handleAddPart = () => {
    if (partToAddId === 0) return;

    const isAlreadyAdded = selectedParts.some((p) => p.id === partToAddId);
    if (isAlreadyAdded) {
      notification.warning({ message: "Part has been added" });
      setPartToAddId(0);
      return;
    }

    const partDetails = allParts.find((p) => p.id === partToAddId);
    if (!partDetails) return;

    const partToAdd: PartInService = {
      id: partDetails.id,
      name: partDetails.name,
      image: partDetails.imageUrl,
    };
    setSelectedParts((prev) => [...prev, partToAdd]);
    setPartToAddId(0);
  };

  const handleRemovePart = (partId: number) => {
    setSelectedParts((prev) => prev.filter((p) => p.id !== partId));
  };

  const availableParts = allParts.filter((part) => !selectedParts.some((selected) => selected.id === part.id));

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
                  <option key={category.id} value={category.id} disabled={!category.isActive}>
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

            <InputGroup>
              <StyledLabel htmlFor="service-parts">Associated Parts</StyledLabel>
              <PartSelectionWrapper>
                <InputGroup className="part-select-group">
                  <StyledSelect
                    id="service-parts"
                    value={partToAddId}
                    onChange={(e) => setPartToAddId(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    <option value="0" disabled>
                      Select a part to add...
                    </option>
                    {selectedParts.length === 0 && allParts.length > 0 && (
                      <option value="0" disabled>
                        All parts already added
                      </option>
                    )}
                    {availableParts.map((part) => (
                      <option key={part.id} value={part.id} disabled={part.isDeleted}>
                        {part.name} - (Quantity: {part.quantity})
                      </option>
                    ))}
                  </StyledSelect>
                </InputGroup>

                <ModalButton
                  type="button"
                  $isConfirm={true}
                  className="part-add-button"
                  onClick={handleAddPart}
                  disabled={isSubmitting || partToAddId === 0}
                >
                  Add
                </ModalButton>
              </PartSelectionWrapper>

              <PartPillContainer>
                {selectedParts.length > 0 ? (
                  <AnimatePresence>
                    {selectedParts.map(
                      (part) =>
                        selectedParts.includes(part) && (
                          <motion.div
                            key={part.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <PartPill>
                              <img src={part.image} alt={part.name} />
                              <span>{part.name}</span>
                              <PartPillRemoveButton
                                type="button"
                                onClick={() => handleRemovePart(part.id)}
                                disabled={isSubmitting}
                              >
                                <FaTimes />
                              </PartPillRemoveButton>
                            </PartPill>
                          </motion.div>
                        )
                    )}
                  </AnimatePresence>
                ) : (
                  <p className="empty-parts-text">No parts associated. Add parts from the dropdown above.</p>
                )}
              </PartPillContainer>
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
