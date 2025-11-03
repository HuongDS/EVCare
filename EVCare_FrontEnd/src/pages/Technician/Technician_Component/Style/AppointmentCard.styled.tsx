import styled from "styled-components";
import {
  damageColorMap,
  type DamageLevelEnum,
} from "../../../../models/enums/DamageLevelEnum";

export const CardContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.05rem;
`;

export const ImageCarousel = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0.5rem 0;
  border-radius: 6px;
  background: #f4f4f4;
`;

export const ImageItem = styled.div`
  min-width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SectionBox = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`;

export const InfoBox = styled(SectionBox)`
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

export const SubTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 400;
  color: #777;
`;

export const ListWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  ul {
    padding-left: 1rem;
    margin: 0;
    font-size: 0.95rem;
  }
  .empty {
    color: #888;
    font-size: 0.9rem;
  }
`;

export const PartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;

  img {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 6px;
  }
`;

export const DamageLevelBadgeStyled = styled.span<{ $level: DamageLevelEnum }>`
  padding: 3px 6px;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${({ $level }) => damageColorMap[$level] || "#999"};
`;

export const ListSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8rem;
`;
