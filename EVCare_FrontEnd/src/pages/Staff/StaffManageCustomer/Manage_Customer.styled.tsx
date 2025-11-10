import { Avatar, Badge, Card } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  * {
    font-family: "Outfit", sans-serif;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .icon {
    border: 1px solid #ccc;
    padding: 0.75rem;
    border-radius: 10px;
    color: black;
    display: flex;
  }

  .content {
    h3 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    p {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
    }
  }
`;

export const FilterSection = styled.div`
  display: flex;
  justify-content: flex-end;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CustomerGrid = styled.div`
  padding: 5px 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CustomerCard = styled(Card)<{ $banned: boolean }>`
  border: 1px solid ${({ $banned }) => ($banned ? "#fca5a5" : "#e5e7eb")};
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  height: 100%;
  opacity: ${({ $banned }) => ($banned ? 0.8 : 1)};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: ${({ $banned }) => ($banned ? "#f87171" : "#00ad4e")};
  }

  .ant-card-body {
    padding: 1.5rem;
  }
`;

export const CustomerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const CustomerAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #00ad4e 0%, #50eb25 100%);
  box-shadow: 0 4px 12px rgba(125, 246, 59, 0.3);
  flex-shrink: 0;
`;

export const CustomerInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .customer-id {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const StatusBadge = styled(Badge)<{ $banned: boolean }>`
  .ant-badge-status-dot {
    width: 10px;
    height: 10px;
  }

  .ant-badge-status-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ $banned }) => ($banned ? "#dc2626" : "#22c55e")};
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;

  svg {
    color: #64748b;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .content {
    flex: 1;
    min-width: 0;
    display: grid;
    grid-template-columns: 0.2fr 1fr;

    .label {
      font-weight: 500;
      color: #334155;
      font-size: 0.875rem;
      margin-bottom: 0.125rem;
    }

    .value {
      color: #64748b;
      font-size: 0.9rem;
      word-break: break-word;
    }
  }
`;

export const VehiclesSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;

  .vehicles-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6d8b64;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
`;

export const VehicleTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #d9f5d3;
  border: 1px solid #defedb;
  color: #00ad4e;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;

  .plate {
    font-weight: 600;
    font-family: monospace;
  }

  .category {
    color: #00ad4e;
    font-size: 0.75rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  justify-items: center;
  padding: 3rem;
  color: #64748b;
  grid-column: 1 / -1;

  svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
`;
