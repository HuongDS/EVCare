import styled from "styled-components";
import {
  damageColorMap,
  type DamageLevelEnum,
} from "../../../../models/enums/DamageLevelEnum";
export const CardContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
`;

export const ImageCarousel = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0.5rem 0;
  border-radius: 8px;
  background: #f4f4f4;
`;

export const ImageItem = styled.div`
  min-width: 150px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  gap: 2rem;
`;

export const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SectionContainer = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

export const SubTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  color: #777;
`;

export const ListWrapper = styled.div`
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.5rem;
  ul {
    padding-left: 1rem;
    margin: 0;
  }
  .empty {
    color: #888;
    font-size: 0.95rem;
  }
`;

export const ListSection = styled.div`
  display: flex;
  gap: 2rem;
`;

export const PartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const DamageLevelBadgeStyled = styled.span<{ $level: DamageLevelEnum }>`
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $level }) => damageColorMap[$level] || "#999"};
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;
