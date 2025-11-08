import styled from "styled-components";

export const PageContainer = styled.div`
  height: 100%;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

export const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #00ad4e;
  color: #00ad4e;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f8f4;
    transform: translateX(-4px);
  }
`;

export const HeaderText = styled.div`
  flex: 1;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightPanel = styled.div``;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

export const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  svg {
    color: #00ad4e;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  svg {
    color: #999;
    flex-shrink: 0;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  font-family: "Outfit", sans-serif;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

export const CustomerResults = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

export const CustomerCard = styled.div<{ $banned: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.$banned ? "#ffcdd2" : "#e8f5e9")};
  background: ${(props) => (props.$banned ? "#fff5f5" : "#f8fdf9")};
  border-radius: 10px;
  cursor: ${(props) => (props.$banned ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$banned ? 0.6 : 1)};
  transition: all 0.3s ease;

  &:hover {
    ${(props) =>
      !props.$banned &&
      `
      border-color: #00ad4e;
      background: #e8f5e9;
      transform: translateX(4px);
    `}
  }
`;

export const CustomerInfo = styled.div`
  flex: 1;
`;

export const CustomerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BannedTag = styled.span`
  padding: 2px 8px;
  background: #f44336;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
`;

export const CustomerDetails = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 6px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;

  svg {
    color: #00ad4e;
  }
`;

export const VehicleCount = styled.div`
  padding: 6px 12px;
  background: #e8f5e9;
  color: #00ad4e;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
`;

export const SelectedCustomer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #e8f5e9;
  border: 2px solid #00ad4e;
  border-radius: 12px;
`;

export const SelectedLabel = styled.div`
  font-size: 12px;
  color: #00ad4e;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const SelectedInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RemoveButton = styled.button`
  padding: 6px 12px;
  background: white;
  border: 1px solid #00ad4e;
  color: #00ad4e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f8f4;
  }
`;

export const VehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

export const VehicleCard = styled.div<{ $selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid ${(props) => (props.$selected ? "#00ad4e" : "#e0e0e0")};
  background: ${(props) => (props.$selected ? "#e8f5e9" : "white")};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.15);
  }
`;

export const VehicleImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

export const VehicleInfo = styled.div`
  flex: 1;
`;

export const VehicleCategory = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
`;

export const VehiclePlate = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-top: 4px;
`;

export const SelectedBadge = styled.div`
  width: 32px;
  height: 32px;
  background: #00ad4e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;

  p {
    margin-top: 16px;
    font-size: 15px;
  }
`;

export const SummaryBox = styled.div`
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e8f5e9;
  }
`;

export const SummaryLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 600;
`;

export const SummaryValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 700;
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 600;

  svg {
    color: #00ad4e;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: "Outfit", sans-serif;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }
`;

export const UploadButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #00ad4e;
  font-size: 13px;
  font-weight: 600;
`;

export const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  padding: 16px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    color: #00ad4e;
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Required = styled.label`
  color: red;
`;
