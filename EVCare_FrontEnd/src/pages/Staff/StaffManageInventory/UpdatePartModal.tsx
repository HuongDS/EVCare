import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  DollarOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { PartDetail } from "../../../models/PartModel/PartModel";
import type { UpdateInventoryPayload } from "../../../models/Inventory/InventoryModel";
import {
  useUpdateInventoryImage,
  useUpdateInventoryQuantity,
} from "../../../services/staffService";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../../context/useNotification";
import {
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";

const { TextArea } = Input;

interface FormErrors {
  [key: string]: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  part?: PartDetail;
}

const UpdatePartModal = ({ isOpen, setIsOpen, part }: ModalProps) => {
  const notification = useNotification();
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    part?.imageUrl
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<UpdateInventoryPayload>({
    id: 0,
    description: "",
    unitPrice: 0,
    stock: 0,
    image: "",
  });

  useEffect(() => {
    if (part) {
      setFormData({
        id: part.id,
        description: part.description,
        unitPrice: part.price,
        stock: part.quantity,
        image: part.imageUrl,
      });
      setPreviewImage(part.imageUrl);
    }
  }, [part, isOpen]);

  const { mutateAsync: uploadImage } = useUpdateInventoryImage();

  const handleCustomRequest = async (options: any) => {
    const { file } = options;

    if (!file.type || !file.type.startsWith("image/")) {
      return;
    }

    const previewUrl = URL.createObjectURL(file as File);
    setPreviewImage(previewUrl);

    try {
      const imgUrl = await uploadImage(file as File);
      updateFormField("image", imgUrl);
      setPreviewImage(imgUrl);
    } catch (error) {
      notification.error({
        message: MSG_TITLE.UPLOAD_IMAGE,
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  const updateFormField = (field: keyof UpdateInventoryPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData?.description?.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData?.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = "Valid price is required";
    }
    if (formData?.stock == null || formData?.stock < 0) {
      newErrors.stock = "Valid stock is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { mutateAsync: updateQuantity, isPending: updating } =
    useUpdateInventoryQuantity();
  const queryClient = useQueryClient();
  const handleSave = async () => {
    if (!validateForm()) {
      message.error("Please fill in all required fields correctly");
      return;
    }
    try {
      await updateQuantity(formData);
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["PartList"] });
      notification.success({
        message: MSG_TITLE.UPDATE_INVENTORY,
        description: SUCCESS_MESSAGE.INVENTORY_UPDATED_SUCCESSFULLY,
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: MSG_TITLE.UPDATE_INVENTORY,
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  const renderImageUpload = () => (
    <ImageUploadContainer>
      {previewImage ? (
        <div style={{ position: "relative" }}>
          <ImagePreview src={previewImage || part?.imageUrl} alt="Preview" />
          <ImageOverlay>
            <Upload
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              customRequest={handleCustomRequest}
            >
              <Button
                icon={<UploadOutlined />}
                size="small"
                style={{ borderRadius: "6px", backgroundColor: "white" }}
              >
                Change Image
              </Button>
            </Upload>
          </ImageOverlay>
        </div>
      ) : (
        <Upload
          accept="image/*"
          maxCount={1}
          showUploadList={false}
          customRequest={handleCustomRequest}
        >
          <UploadPlaceholder>
            <PlaceholderIcon />
            <PlaceholderText>Click to upload image</PlaceholderText>
            <PlaceholderHint>PNG, JPG up to 10MB</PlaceholderHint>
          </UploadPlaceholder>
        </Upload>
      )}
    </ImageUploadContainer>
  );

  return (
    <Modal
      title={
        <div
          style={{
            fontSize: "18px",
            fontWeight: 600,
            fontFamily: "'Outfit','sans-serif'",
          }}
        >
          Update Part Information
        </div>
      }
      open={isOpen}
      onOk={handleSave}
      okText="Save Changes"
      onCancel={() => setIsOpen(false)}
      cancelText="Cancel"
      width={800}
      confirmLoading={updating}
      okButtonProps={{
        style: {
          fontFamily: "Outfit",
        },
      }}
      cancelButtonProps={{
        style: { fontFamily: "Outfit" },
      }}
    >
      <ModalContent>
        <div>
          <SectionHeader>Part Details</SectionHeader>

          <FormField>
            <Label>Part Name</Label>
            <Tooltip title="You don't have permission to edit">
              <Input value={part?.name} disabled />
            </Tooltip>
          </FormField>
          <FormField>
            <Label>
              Description <Required>*</Required>
            </Label>
            <TextArea
              rows={4}
              placeholder="Enter detailed part description..."
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              status={errors.description ? "error" : ""}
              style={{ borderRadius: "8px" }}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </FormField>

          <FieldRow>
            <FormField>
              <Label>
                Unit Price (đ) <Required>*</Required>
              </Label>
              <InputNumber
                min={0}
                placeholder="0.00"
                value={formData.unitPrice}
                onChange={(value) => updateFormField("unitPrice", value || 0)}
                prefix={<DollarOutlined style={{ color: "#bfbfbf" }} />}
                status={errors.unitPrice ? "error" : ""}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              {errors.unitPrice && <ErrorText>{errors.unitPrice}</ErrorText>}
            </FormField>

            <FormField>
              <Label>
                Stock Quantity <Required>*</Required>
              </Label>
              <InputNumber
                min={0}
                placeholder="0"
                value={formData.stock}
                onChange={(value) => updateFormField("stock", value || 0)}
                prefix={<InboxOutlined style={{ color: "#bfbfbf" }} />}
                status={errors.stock ? "error" : ""}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              {errors.stock && <ErrorText>{errors.stock}</ErrorText>}
            </FormField>
          </FieldRow>
        </div>
        <div>
          <SectionHeader>Part Image</SectionHeader>
          {renderImageUpload()}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default UpdatePartModal;

import {
  ErrorText,
  FieldRow,
  FormField,
  ImageOverlay,
  ImagePreview,
  ImageUploadContainer,
  Label,
  ModalContent,
  PlaceholderHint,
  PlaceholderIcon,
  PlaceholderText,
  Required,
  SectionHeader,
  UploadPlaceholder,
} from "./styles/UpdatePartModal.styled";
