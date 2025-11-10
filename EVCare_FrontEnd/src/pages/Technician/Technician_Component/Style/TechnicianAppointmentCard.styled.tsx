import styled from "styled-components";
import { TechnicianWorkingSessionEnum } from "../../../../models/enums";
import { DamageLevelEnum } from "../../../../models/enums/DamageLevelEnum";

export const CardWrapper = styled.div<{ $status: string }>`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);

  .id-badge {
    font-size: 1.1rem;
    font-weight: 700;
    color: #00ad4e;
    background: rgba(0, 173, 78, 0.1);
    padding: 6px 12px;
    border-radius: 8px;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  margin-left: auto;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ $status }) => {
    switch ($status) {
      case TechnicianWorkingSessionEnum.COMPLETED:
        return "#166534";
      case TechnicianWorkingSessionEnum.CANCELED:
        return "#b91c1c";
      case TechnicianWorkingSessionEnum.INPROGRESS:
        return "#1d4ed8";
      default:
        return "#374151";
    }
  }};
  background: ${({ $status }) => {
    switch ($status) {
      case TechnicianWorkingSessionEnum.COMPLETED:
        return "#dcfce7";
      case TechnicianWorkingSessionEnum.CANCELED:
        return "#fee2e2";
      case TechnicianWorkingSessionEnum.INPROGRESS:
        return "#dbeafe";
      default:
        return "#f3f4f6";
    }
  }};
`;

export const CardBody = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: #374151;

  svg {
    color: #00ad4e;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  span {
    font-weight: 500;
    word-break: break-word;
  }
`;

export const ImageCarousel = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 20px 20px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const ImageItem = styled.div`
  flex-shrink: 0;
  width: 150px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ListSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 0 20px 20px 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionBox = styled.div`
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 16px;
`;

export const SectionTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
  border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  padding-bottom: 8px;

  svg {
    color: #00ad4e;
  }
`;

export const SubTitle = styled.span`
  font-size: 0.7rem;
  font-weight: 400;
  color: #777;
  margin-left: 4px;
`;

export const ListWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  padding-right: 5px;

  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    font-weight: 500;
    color: #374151;
  }

  .empty {
    font-style: italic;
    color: #6b7280;
    font-size: 0.9rem;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 3px;
  }
`;

export const PartItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const ButtonWrapper = styled.div`
  padding: 20px;
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(0, 173, 78, 0.1);
  margin-top: auto;
`;

const getBadgeStyles = (level: DamageLevelEnum) => {
  switch (level) {
    case DamageLevelEnum.Minor:
      return `
        background: #ecfdf5; 
        color: #065f46;      
        border: 1px solid #a7f3d0; 
      `;
    case DamageLevelEnum.Moderate:
      return `
        background: #fffbeb; 
        color: #b45309;     
        border: 1px solid #fde68a; 
      `;
    case DamageLevelEnum.Severe:
      return `
        background: #fff1f2; 
        color: #b91c1c;      
        border: 1px solid #fecaca; 
      `;
    case DamageLevelEnum.Critical:
      return `
        background: #fee2e2; 
        color: #991b1b;      
        border: 1px solid #fca5a5; 
      `;
    case DamageLevelEnum.NotAssessed:
    default:
      return `
        background: #f3f4f6; 
        color: #4b5563;      
        border: 1px solid #e5e7eb; 
      `;
  }
};

export const DamageLevelBadgeStyled = styled.span<{ $level: DamageLevelEnum }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  flex-shrink: 0;

  ${({ $level }) => getBadgeStyles($level)}
`;

export const PartsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th,
  td {
    padding: 10px 8px;
    text-align: left;
    border-bottom: 1px solid rgba(0, 173, 78, 0.1);
  }

  thead th {
    font-weight: 600;
    color: #374151;
    padding-bottom: 12px;
  }

  tbody td {
    color: #1f2937;
    font-weight: 500;
    vertical-align: middle;
  }

  th:nth-child(2),
  td:nth-child(2) {
    text-align: center;
  }
  th:nth-child(3),
  td:nth-child(3) {
    text-align: right;
  }
  th:nth-child(4),
  td:nth-child(4) {
    text-align: right;
  }
`;

export const ServicePillContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const ServicePill = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
`;
