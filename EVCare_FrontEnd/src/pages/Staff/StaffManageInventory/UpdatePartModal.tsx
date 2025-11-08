import { useEffect, useState } from "react";
import { Modal, Input, InputNumber, Button, Upload, message, Tooltip } from "antd";
import styled from "styled-components";
import { UploadOutlined, PictureOutlined, DollarOutlined, InboxOutlined } from "@ant-design/icons";
import type { PartDetailDto } from "../../../models/PartModel/PartModel";
import type { UpdateInventoryPayload } from "../../../models/Inventory/InventoryModel";
import { useUpdateInventoryImage, useUpdateInventoryQuantity } from "../../../services/staffService";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../../../context/useNotification";
import { MSG_TITLE, SUCCESS_MESSAGE } from "../../../constants/messages/Message";

const { TextArea } = Input;

interface FormErrors {
  [key: string]: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  part?: PartDetailDto;
}

const UpdatePartModal = ({ isOpen, setIsOpen, part }: ModalProps) => {
  const notification = useNotification();
  const [previewImage, setPreviewImage] = useState<string | undefined>(part?.imageUrl);
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
        stock: part.stock,
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

  const { mutateAsync: updateQuantity, isPending: updating } = useUpdateInventoryQuantity();
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
            <Upload accept="image/*" maxCount={1} showUploadList={false} customRequest={handleCustomRequest}>
              <Button icon={<UploadOutlined />} size="small" style={{ borderRadius: "6px", backgroundColor: "white" }}>
                Change Image
              </Button>
            </Upload>
          </ImageOverlay>
        </div>
      ) : (
        <Upload accept="image/*" maxCount={1} showUploadList={false} customRequest={handleCustomRequest}>
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

const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
`;

const Required = styled.span`
  color: #ff4d4f;
`;

const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  overflow: hidden;
  background-color: #fafafa;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    border-color: #1890ff;
    background-color: #f0f5ff;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
`;

const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 40px 16px 12px;
`;

const UploadPlaceholder = styled.div`
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
`;

const PlaceholderIcon = styled(PictureOutlined)`
  font-size: 48px;
  color: #bfbfbf;
`;

const PlaceholderText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  text-align: center;
`;

const PlaceholderHint = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
`;
