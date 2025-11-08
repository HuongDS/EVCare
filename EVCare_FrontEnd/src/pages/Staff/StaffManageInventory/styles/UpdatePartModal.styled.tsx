import styled from "styled-components";
import { PictureOutlined } from "@ant-design/icons";

export const ModalContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  font-family: "Outfit", sans-serif;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormField = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #262626;
`;

export const Required = styled.span`
  color: #ff4d4f;
`;

export const ErrorText = styled.div`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const ImageUploadContainer = styled.div`
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

export const ImagePreview = styled.img`
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
`;

export const ImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 40px 16px 12px;
`;

export const UploadPlaceholder = styled.div`
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
`;

export const PlaceholderIcon = styled(PictureOutlined)`
  font-size: 48px;
  color: #bfbfbf;
`;

export const PlaceholderText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #595959;
  text-align: center;
`;

export const PlaceholderHint = styled.div`
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
`;
