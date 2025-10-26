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
} from "./Admin_Service.styled";
import { FaTimes, FaSave, FaMagic } from "react-icons/fa";
import { useNotification } from "../../../../context/useNotification";
import { Editor } from "@tinymce/tinymce-react";
import type { Service } from "../../../../models/ServicesModel/ServiceViewModel";
import type { ServiceCreateDto } from "../../../../models/ServicesModel/ServiceCreateDto";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceToEdit: Service | null;
  addApiFn: (data: ServiceCreateDto) => void;
  updateApiFn: (data: Service) => void;
}

// Giả lập API gọi Gemini
const generateServiceDetails = async (serviceName: string): Promise<{ description: string; duration: number }> => {
  console.log(`Generating details for: ${serviceName}`);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // --- LOGIC GỌI GEMINI API THẬT SẼ Ở ĐÂY ---
  // Bạn sẽ dùng fetch() để gọi API Gemini với prompt phù hợp
  // Ví dụ prompt: `Provide a short description and estimated duration in hours (as a number, e.g., 1.5) for the car maintenance service named '${serviceName}'. Format the response as JSON: {"description": "...", "duration": X.X}`
  // Sau đó parse JSON response trả về

  // Dữ liệu trả về mẫu
  if (serviceName.toLowerCase().includes("oil change")) {
    return { description: "Standard replacement of engine oil and filter.", duration: 0.5 };
  } else if (serviceName.toLowerCase().includes("tire")) {
    return { description: "Rotation of tires to ensure even wear and extend lifespan.", duration: 0.75 };
  } else {
    return {
      description: `Detailed description for ${serviceName}.`,
      duration: Math.round(Math.random() * 3 + 1) * 0.5,
    };
  }
};

const ServiceFormModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, serviceToEdit, addApiFn, updateApiFn }) => {
  const isUpdateMode = !!serviceToEdit;
  const notification = useNotification();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isUpdateMode && serviceToEdit) {
      setFormData({
        name: serviceToEdit.name,
        description: serviceToEdit.description,
        duration: serviceToEdit.duration,
      });
    } else {
      setFormData({ name: "", description: "", duration: 0 });
    }
  }, [isOpen, isUpdateMode, serviceToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
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
    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      if (isUpdateMode && serviceToEdit) {
        await updateApiFn(serviceToEdit);
      } else {
        await addApiFn(payload);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to submit form", error);
      notification.error({ message: "Error", description: (error as Error).message || "Could not save service." });
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
        transition={{ type: "spring", damping: 30, stiffness: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
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
            <StyledLabel htmlFor="service-description">Description</StyledLabel>
            <Editor
              apiKey={import.meta.env.VITE_TINY_KEY} // Thay key của bạn vào đây
              value={formData.description}
              init={{
                height: 250,
                menubar: false,
                plugins: "lists link autoresize",
                toolbar: "undo redo | bold italic underline | bullist numlist | removeformat",
                content_style:
                  "body { font-family:'Outfit',sans-serif; font-size:14px; line-height:1.6; color: #334155; }",
                skin: "oxide",
                content_css: "default",
                autoresize_bottom_margin: 10,
              }}
              onEditorChange={handleEditorChange}
              disabled={isSubmitting || isGenerating}
            />
          </InputGroup>

          <InputGroup>
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
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default ServiceFormModal;
