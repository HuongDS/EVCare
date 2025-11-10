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
import { FaMagic, FaSave } from "react-icons/fa";
import { useNotification } from "../../../../context/useNotification";
import type { PartCategoryCreateDto } from "../../../../models/PartModel/PartCategoryCreateDto";
import { createPartCategory } from "../../../../services/partCategoryApi";
import { callGemini } from "../../../../services/geminiServices";
import { GenerateButton } from "../../AdminService&Parts/AdminService/Admin_Service.styled";

interface Props {
  onAddSuccess: () => void;
}

export default function PartCategoryForm({ onAddSuccess }: Props) {
  const [formData, setFormData] = useState<PartCategoryCreateDto>({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.name.trim().length <= 0) {
      throw new Error("Please enter a part category name.");
    }
    if (!formData.description || formData.description.trim().length <= 0) {
      throw new Error("Please enter a part category description.");
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
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
    setIsSubmitting(false);
  };

  const handleGeneratingDescription = async () => {
    if (!formData.name || formData.name.trim().length <= 0) {
      notification.warning({
        message: "Warning",
        description: "Please enter a category name.",
        showProgress: true,
      });
      return;
    }
    setIsGenerating(true);

    const data = `Part Category Name: ${formData.name.trim()}`;
    const prompt = `
      You are an assistant for EVCare.
      Your task is to generate a concise, professional description (1-2 sentences) for a given part category.
      You MUST respond in the required JSON format.
      You MUST set the 'duration' field to 0.
    `;

    try {
      const response = await callGemini(data, prompt, 3, 1000);
      if (response && response.description) {
        setFormData((prev) => ({ ...prev, description: response.description }));
        notification.success({
          message: "Success",
          description: "Description generated successfully.",
          showProgress: true,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Failed to generate description.",
          showProgress: true,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
    setIsGenerating(false);
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

      <GenerateButton type="button" onClick={handleGeneratingDescription} disabled={isGenerating}>
        {isGenerating ? <LoadingSpinner /> : <FaMagic />}
        Generate Description
      </GenerateButton>

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
