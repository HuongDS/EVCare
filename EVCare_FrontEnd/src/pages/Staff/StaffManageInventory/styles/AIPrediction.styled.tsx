import { Card, Input, InputNumber, Select } from "antd";
import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  background: white;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderText = styled.div`
  flex: 1;
`;

export const ForecastSection = styled.div`
  margin-bottom: 24px;
`;

export const ForecastCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #00ad4e;
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
`;

export const ForecastLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 700;
  color: #00ad4e;
  margin-bottom: 16px;
`;

export const ForecastControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledInputNumber = styled(InputNumber)`
  flex: 1;

  .ant-input-number-input {
    font-family: "Outfit", sans-serif;
    font-size: 16px;
    font-weight: 600;
    height: 48px;
  }

  &.ant-input-number {
    border-radius: 10px;
    border: 2px solid #e0e0e0;
  }

  &.ant-input-number-focused {
    border-color: #00ad4e;
  }
`;

export const PredictButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 32px;
  height: 48px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  min-width: 150px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e0e0e0;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const ForecastHint = styled.div`
  font-size: 13px;
  color: #666;
  font-style: italic;
`;

export const SummarySection = styled.div`
  margin-bottom: 24px;
`;

export const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e8f5e9;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.15);
  }

  .ant-statistic-title {
    font-size: 14px;
    font-weight: 600;
    color: #666;
  }

  .ant-statistic-content {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SearchInput = styled(Input)`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  font-family: "Outfit", sans-serif;

  &:focus,
  &:hover {
    border-color: #00ad4e;
  }

  .ant-input {
    font-family: "Outfit", sans-serif;
  }
`;

export const FilterSelect = styled(Select)`
  width: 200px;
  height: 44px;

  .ant-select-selector {
    height: 44px !important;
    border-radius: 10px !important;
    border: 2px solid #e0e0e0 !important;
    font-family: "Outfit", sans-serif;
    display: flex;
    align-items: center;
  }

  &:hover .ant-select-selector,
  &.ant-select-focused .ant-select-selector {
    border-color: #00ad4e !important;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TableCard = styled(Card)`
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: none;

  .ant-table-thead > tr > th {
    background: #f8fdf9;
    font-weight: 700;
    color: #333;
    font-family: "Outfit", sans-serif;
    border-bottom: 2px solid #e8f5e9;
  }

  .ant-table-tbody > tr {
    font-family: "Outfit", sans-serif;
    transition: all 0.3s ease;
  }

  .ant-table-tbody > tr:hover {
    background: #f8fdf9;
  }

  .ant-tag {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 6px;
  }
`;

export const PartName = styled.span`
  font-weight: 600;
  color: #333;
`;

export const QuantityText = styled.span<{ $needRefill: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => (props.$needRefill ? "#ff4d4f" : "#52c41a")};
`;

export const ViewReasonButton = styled.button`
  width: fit-content;
  padding: 3px 5px;
  background: #00ad4e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00c853;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 173, 78, 0.3);
  }
`;

export const ReasonContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  font-family: "Outfit", sans-serif;
  max-width: 400px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 16px;
  padding: 80px 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  svg {
    margin-bottom: 20px;
    color: #00ad4e;
  }
`;

export const EmptyText = styled.div`
  font-size: 16px;
  color: #666;
  font-weight: 500;
`;
