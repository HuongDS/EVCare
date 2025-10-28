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
  StyledTextArea,
  ModalFooter,
  ModalButton,
  LoadingSpinner,
} from "../AdminService&Parts/AdminService/Admin_Service.styled";
import { FaTimes, FaSave } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import { updatePartCategory } from "../../../services/partCategoryApi";
import type { PartCategoryCreateDto } from "../../../models/PartModel/PartCategoryCreateDto";
import { updateServiceCategory } from "../../../services/serviceServicesApi";

type CategoryType = "Part" | "Service";

interface Props {
  onClose: () => void;
  categoryType: CategoryType;
  itemToEdit: any;
  handleAddOrUpdateSuccess: () => void;
}

export default function CategoryEditModal({ onClose, categoryType, itemToEdit, handleAddOrUpdateSuccess }: Props) {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        description: itemToEdit.description || "",
      });
    }
  }, [itemToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let response;
      switch (categoryType) {
        case "Part":
          if (!formData.name || formData.name.trim().length <= 0) {
            throw new Error("Please enter a category name.");
          }
          if (!formData.description || formData.description.trim().length <= 0) {
            throw new Error("Please enter a category description.");
          }
          const data: PartCategoryCreateDto = {
            name: formData.name,
            description: formData.description,
          };
          response = await updatePartCategory(itemToEdit.id, data);
          break;
        case "Service":
          if (!formData.name || formData.name.trim().length <= 0) {
            throw new Error("Please enter a category name.");
          }
          if (!formData.description || formData.description.trim().length <= 0) {
            throw new Error("Please enter a category description.");
          }
          const serviceData: PartCategoryCreateDto = {
            name: formData.name,
            description: formData.description,
          };
          response = await updateServiceCategory(itemToEdit.id, serviceData);
          break;
      }
      notification.success({ message: "Success", description: response.message });
      handleAddOrUpdateSuccess();
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsSubmitting(false);
  };

  const showDescription = categoryType === "Part" || categoryType === "Service";

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
          <ModalTitle>Edit {categoryType} Category</ModalTitle>
          <ModalCloseButton type="button" onClick={onClose}>
            <FaTimes />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <StyledLabel htmlFor="edit-name">Category Name</StyledLabel>
            <StyledInput
              id="edit-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </InputGroup>

          {showDescription && (
            <InputGroup>
              <StyledLabel htmlFor="edit-description">Description</StyledLabel>
              <StyledTextArea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isSubmitting}
                rows={4}
              />
            </InputGroup>
          )}
        </ModalBody>
        <ModalFooter>
          <ModalButton type="button" $isConfirm={false} onClick={onClose} disabled={isSubmitting}>
            Cancel
          </ModalButton>
          <ModalButton type="submit" $isConfirm={true} disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner /> : <FaSave />}
            Save Changes
          </ModalButton>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
}
