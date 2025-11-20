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

export const HeaderIcon = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
`;

export const HeaderText = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 6px 0;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin: 0;
`;

export const ProgressCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #e8f5e9;
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const ProgressTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

export const ProgressStats = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #00ad4e;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #e8f5e9;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
`;

export const ProgressBar = styled.div<{ $percentage: number }>`
  width: ${(props) => props.$percentage}%;
  height: 100%;
  background: linear-gradient(90deg, #00ad4e 0%, #00c853 100%);
  border-radius: 10px;
  transition: width 0.5s ease;
`;

export const ProgressPercentage = styled.div`
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
`;

export const Section = styled.div`
  margin-bottom: 28px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0;

  svg {
    color: #00ad4e;
  }
`;

export const LockedHint = styled.div`
  font-size: 13px;
  color: #999;
  font-weight: 500;
  font-style: italic;
`;

export const PartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PartCard = styled.div<{ $completed?: boolean; $locked?: boolean }>`
  position: relative;
  background: white;
  border: 2px solid ${(props) => (props.$completed ? "#00ad4e" : "#e8f5e9")};
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.$locked ? 0.7 : 1)};

  &:hover {
    ${(props) =>
      !props.$locked &&
      `
      border-color: #00ad4e;
      box-shadow: 0 6px 16px rgba(0, 173, 78, 0.15);
      transform: translateY(-2px);
    `}
  }
`;

export const LockOverlay = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #999;
  z-index: 1;
`;

export const PartImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
  border: 2px solid #e8f5e9;
`;

export const PartInfo = styled.div`
  margin-bottom: 16px;
`;

export const PartName = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
`;

export const TechInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 500;
  margin-bottom: 12px;

  svg {
    color: #00ad4e;
  }
`;

export const PartDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailLabel = styled.div`
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
`;

export const DetailValue = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 700;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  background: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "minor":
        return "#e8f5e9";
      case "moderate":
        return "#fff3e0";
      case "severe":
        return "#ffebee";
      case "critical":
        return "#ffcdd2";
      default:
        return "#f5f5f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status.toLowerCase()) {
      case "minor":
        return "#2e7d32";
      case "moderate":
        return "#e65100";
      case "severe":
        return "#d32f2f";
      case "critical":
        return "#b71c1c";
      default:
        return "#666";
    }
  }};
`;

export const ActionButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CompletedBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  border: 2px solid #00ad4e;
`;

export const WaitingBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: #fff3e0;
  color: #e65100;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid #ffcc80;
`;
