import React, { useState } from "react";
import {
  FormWrapper,
  InputGroup,
  StyledLabel,
  StyledInput,
  StyledTextArea,
  FormActions,
  SubmitButton,
  LoadingSpinner,
} from "./Admin_Category.styled";
import { FaSave } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import type { PartCategoryCreateDto } from "../../../models/PartModel/PartCategoryCreateDto";
import { createPartCategory } from "../../../services/partCategoryApi";

interface Props {
  onAddSuccess: () => void;
}

export default function PartCategoryForm({ onAddSuccess }: Props) {
  const [formData, setFormData] = useState<PartCategoryCreateDto>({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length <= 0) {
      throw new Error("Please enter a category name.");
    }
    if (!formData.description || formData.description.trim().length <= 0) {
      throw new Error("Please enter a category description.");
    }
    setIsSubmitting(true);
    try {
      const data: PartCategoryCreateDto = {
        name: formData.name,
        description: formData.description,
      };
      await createPartCategory(data);
      onAddSuccess();
      setFormData({ name: "", description: "" });
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsSubmitting(false);
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <InputGroup>
        <StyledLabel htmlFor="part-name">Category Name</StyledLabel>
        <StyledInput
          id="part-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />
      </InputGroup>

      <InputGroup>
        <StyledLabel htmlFor="part-description">Description</StyledLabel>
        <StyledTextArea
          id="part-description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isSubmitting}
          rows={4}
        />
      </InputGroup>

      <FormActions>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner /> : <FaSave />}
          Save Category
        </SubmitButton>
      </FormActions>
    </FormWrapper>
  );
}
