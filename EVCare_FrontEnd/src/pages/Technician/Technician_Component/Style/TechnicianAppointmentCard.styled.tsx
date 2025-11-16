import styled from "styled-components";
import { DamageLevelStringEnum } from "../../../../models/enums/DamageLevelEnum";

export const CardContainer = styled.div`
  background: white;
  border: 2px solid #e8f5e9;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  &:hover {
    border-color: #00ad4e;
    box-shadow: 0 6px 20px rgba(0, 173, 78, 0.15);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  border-bottom: 2px solid #e8f5e9;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const AppointmentId = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #00ad4e;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  background: ${(props) => {
    switch (props.$status) {
      case "In_Progress":
        return "#fff3e0";
      case "Completed":
        return "#e8f5e9";
      case "Pending":
        return "#e3f2fd";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "In_Progress":
        return "#e65100";
      case "Completed":
        return "#2e7d32";
      case "Pending":
        return "#1565c0";
      default:
        return "#616161";
    }
  }};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;

export const CardBody = styled.div`
  padding: 20px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

export const InfoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #e8f5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ad4e;
  flex-shrink: 0;
`;

export const InfoText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoLabel = styled.div`
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 2px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CollapsibleSection = styled.div`
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const PartSection = styled.div`
  border-right: 2px solid #e8f5e9;
  border-left: 2px solid #e8f5e9;
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fdf9;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e8f5e9;
  }

  svg {
    color: #00ad4e;
  }
`;

export const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  padding: 12px;
`;

export const ImageThumb = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e8f5e9;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: scale(1.05);
  }
`;

export const ServiceList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
`;

export const ServiceTag = styled.span`
  padding: 6px 12px;
  background: #e8f5e9;
  color: #00ad4e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
`;

export const PartsContainer = styled.div`
  padding: 12px;
`;

export const PartsTable = styled.table`
  width: 100%;
  font-size: 13px;
  border-collapse: collapse;

  th {
    text-align: left;
    padding: 8px;
    background: #f8fdf9;
    color: #666;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    border-bottom: 2px solid #e8f5e9;
  }

  td {
    padding: 8px;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
    font-weight: 500;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: #f8fdf9;
  }
`;

export const DamageBadge = styled.span<{ $level: DamageLevelStringEnum }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: ${(props) => {
    switch (props.$level) {
      case DamageLevelStringEnum.Minor:
        return "#e8f5e9";
      case DamageLevelStringEnum.Moderate:
        return "#fff3e0";
      case DamageLevelStringEnum.Severe:
        return "#ffe0e0";
      case DamageLevelStringEnum.Critical:
        return "#ffcdd2";
      default:
        return "#00ad4e";
    }
  }};
  color: ${(props) => {
    switch (props.$level) {
      case DamageLevelStringEnum.Minor:
        return "#2e7d32";
      case DamageLevelStringEnum.Moderate:
        return "#e65100";
      case DamageLevelStringEnum.Severe:
        return "#d32f2f";
      case DamageLevelStringEnum.Critical:
        return "#b71c1c";
      default:
        return "#ffffff";
    }
  }};
`;

export const EmptyText = styled.div`
  text-align: center;
  color: #999;
  font-size: 13px;
  padding: 16px;
  font-style: italic;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
