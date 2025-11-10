import { Tag } from "antd";
import styled from "styled-components";

export const ModalContainer = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 24px;
  color: #222;
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;

  h2 {
    font-size: 30px;
    font-weight: 600;
    color: #00ad4e;
  }
`;

export const InfoSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoColumn = styled.div`
  flex: 1;
`;

export const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  margin-bottom: 10px;
  font-size: 15px;
  color: #00ad4e;
  font-weight: bold;

  .label {
    font-weight: 200;
    color: #2d2d2d;
    margin-right: 4px;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2d2d2d;
  margin-bottom: 12px;
`;

export const TagStyled = styled(Tag)`
  font-family: "Outfit", sans-serif;
  font-size: 14px;
  font-weight: 500;
  background-color: #e6f7f1;
  color: #00ad4e;
  border-radius: 16px;
  padding: 4px 12px;
  height: 30px;
  display: flex;
  align-items: center;
`;

export const ServiceTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const PartsTableWrapper = styled.div`
  margin-top: 16px;

  strong {
    font-family: "Outfit", sans-serif;
  }
  .ant-table {
    border-radius: 12px;
    overflow: hidden;
    font-family: "Outfit", sans-serif;
  }

  .ant-table-thead > tr > th {
    background-color: #f0faf5;
    color: #00ad4e;
    font-weight: 600;
    text-align: center;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f6fff9 !important;
  }

  .spinner {
    text-align: center;
    padding: 20px;
  }
`;

export const EmptyText = styled.p`
  color: #888;
  font-size: 14px;
  font-style: italic;
`;
