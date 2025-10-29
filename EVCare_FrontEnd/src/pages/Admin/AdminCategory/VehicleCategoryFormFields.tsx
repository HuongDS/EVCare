import React, { useState, useEffect } from "react";
import {
  InputGroup,
  StyledLabel,
  StyledInput,
  InstructionText,
  LinkInputWrapper,
  PillSelectorWrapper,
  PillButton,
  LoadingOverlay,
  LoadingSpinner,
} from "./Admin_Category.styled";
import { FaCheck, FaCheckCircle, FaTimes } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import type { VehicleCategoryCreateDto } from "../../../models/VehicleModels/VehicleCategoryCreateDto";
import { notification } from "antd";
import { process3DFile } from "../../../services/vehicleServicesApi";
import { getPartCategories } from "../../../services/partApi";
import type { Category } from "../../../models/PartModel/PartModel";

interface Props {
  formData: VehicleCategoryCreateDto;
  setFormData: React.Dispatch<React.SetStateAction<VehicleCategoryCreateDto>>;
  isSubmitting: boolean;
}

export default function VehicleCategoryFormFields({ formData, setFormData, isSubmitting }: Props) {
  const [allPartCategories, setAllPartCategories] = useState<Category[]>([]);
  const [isPartsLoading, setIsPartsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const fetchData = async () => {
    setIsPartsLoading(true);
    try {
      const response = await getPartCategories();
      setAllPartCategories(response?.data?.items ?? []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsPartsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.model3DUrl) {
      try {
        const url = new URL(formData.model3DUrl);
        const pathParts = url.pathname.split("/");
        setFileName(pathParts[pathParts.length - 1] || "Uploaded Model");
      } catch {
        setFileName("Uploaded Model");
      }
    } else {
      setFileName("");
    }
  }, [formData.model3DUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileName("");
      setFormData((prev) => ({ ...prev, model3DUrl: "" }));
      return;
    }

    const validExtensions = [".glb", ".obj", ".gltf", ".stl"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      notification.error({
        message: "Invalid File Type",
        description: "Please select a .glb, .obj, .gltf, or .stl file.",
      });
      e.target.value = "";
      setFileName("");
      setFormData((prev) => ({ ...prev, model3DUrl: "" }));
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setFormData((prev) => ({ ...prev, model3DUrl: "" }));

    try {
      const response = await process3DFile(file);
      setFormData((prev) => ({ ...prev, model3DUrl: response.data ?? "" }));
      notification.success({
        message: "Uploaded successful.",
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: "Upload Failed",
        description: (error as Error).message,
      });
      e.target.value = "";
      setFileName("");
    }
    setIsUploading(false);
  };

  const togglePartCategory = (id: number) => {
    setFormData((prev) => {
      const partCategoryIds = prev.partCategoryIds.includes(id)
        ? prev.partCategoryIds.filter((pid) => pid !== id)
        : [...prev.partCategoryIds, id];
      return { ...prev, partCategoryIds };
    });
  };

  return (
    <>
      <InputGroup>
        <StyledLabel htmlFor="vehicle-name">Category Name</StyledLabel>
        <StyledInput
          id="vehicle-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />
      </InputGroup>

      <InputGroup>
        <StyledLabel htmlFor="vehicle-model-link">3D Model Link</StyledLabel>
        <LinkInputWrapper>
          <StyledInput
            id="vehicle-model-link"
            name="rawLink"
            type="file"
            accept=".glb, .obj, .gltf, .stl"
            onChange={handleFileChange}
            disabled={isSubmitting || isUploading}
          />
          {isUploading ? (
            <div style={{ padding: "0 1rem", display: "grid", placeItems: "center", color: "#00ad4e" }}>
              <LoadingSpinner />
            </div>
          ) : fileName ? (
            <div
              style={{
                padding: "0 1rem",
                display: "flex",
                alignItems: "center",
                color: "#065f46",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "calc(100% - 40px)",
              }}
            >
              <FaCheckCircle style={{ marginRight: "8px", color: "#00ad4e", flexShrink: 0 }} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{fileName}</span>
            </div>
          ) : null}
        </LinkInputWrapper>
        <InstructionText>Select a 3D model file. We will process and host it in our cloud.</InstructionText>
      </InputGroup>

      <InputGroup>
        <StyledLabel>Associated Part Categories</StyledLabel>
        <PillSelectorWrapper>
          <AnimatePresence>
            {isPartsLoading && (
              <LoadingOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingSpinner />
              </LoadingOverlay>
            )}
          </AnimatePresence>
          {allPartCategories.map(
            (cat) =>
              !cat.isDeleted && (
                <PillButton
                  type="button"
                  key={cat.id}
                  $isSelected={formData.partCategoryIds.includes(cat.id)}
                  onClick={() => togglePartCategory(cat.id)}
                  disabled={isSubmitting}
                >
                  {formData.partCategoryIds.includes(cat.id) ? <FaCheck /> : <FaTimes />}
                  {cat.name}
                </PillButton>
              )
          )}
        </PillSelectorWrapper>
        <InstructionText>Select all part categories that apply to this vehicle type.</InstructionText>
      </InputGroup>
    </>
  );
}
