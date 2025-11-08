import { Avatar, Badge, Select } from "antd";
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

export const FilterSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const StyledSelect = styled(Select)`
  min-width: 200px;

  .ant-select-selector {
    border-radius: 8px !important;
    border: 1px solid #e5e7eb !important;
    padding: 0.375rem 0.75rem !important;
    height: auto !important;

    &:hover {
      border-color: #00ad4e !important;
    }
  }

  &.ant-select-focused .ant-select-selector {
    border-color: #00ad4e !important;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
  }
`;

export const StatsBar = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;

  .icon {
    background: #e3f3ea;
    padding: 0.75rem;
    border-radius: 10px;
    color: #00ad4e;
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

export const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const TechHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const TechAvatar = styled(Avatar)`
  width: 64px;
  height: 64px;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #27ec4e 0%, #78d497 100%);
  box-shadow: 0 4px 12px rgba(7, 154, 34, 0.3);
`;

export const TechInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.25rem;
  }

  .tech-id {
    color: #64748b;
    font-size: 0.875rem;
  }
`;

export const StatusBadge = styled(Badge)`
  .ant-badge-status-dot {
    width: 10px;
    height: 10px;
  }

  .ant-badge-status-text {
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 0.75rem;

  svg {
    color: #64748b;
    flex-shrink: 0;
  }

  span {
    color: #475569;
    font-size: 0.9rem;
  }

  .label {
    font-weight: 500;
    color: #334155;
  }
`;

export const SkillTag = styled.span`
  display: inline-block;
  background: #d3f1d8;
  color: #00ad4e;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #dbeafe;
`;

export const FlipCardContainer = styled.div`
  perspective: 1000px;
  width: 100%;
  height: 350px;
`;

export const FlipCardInner = styled.div<{ $flipped: boolean }>`
  position: relative;
  width: 100%;
  height: 350px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  transform: ${({ $flipped }) => ($flipped ? "rotateY(180deg)" : "rotateY(0)")};
`;

const FlipCardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 350px;
  backface-visibility: hidden;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
`;

export const FlipCardFront = styled(FlipCardSide)`
  display: flex;
  flex-direction: column;
`;

export const FlipCardBack = styled(FlipCardSide)`
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-height: 200px;
    overflow-y: auto;
  }
`;
