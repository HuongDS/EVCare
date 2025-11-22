import styled from "styled-components";

export const CardContainer = styled.div`
  font-family: "Outfit", sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  padding: 18px 22px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 18px;
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 4px;
`;

export const StatusBadge = styled.span<{ $approvedColor: string }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.95em;
  font-weight: 600;
  color: #fff;
  background-color: ${(props) => props.$approvedColor};
  text-align: center;
  min-width: 90px;

  @media (max-width: 480px) {
    font-size: 0.85em;
    padding: 5px 12px;
  }
`;

export const DateOff = styled.div`
  font-size: 1.5em;
  font-weight: 600;
  color: #16a34a;

  @media (max-width: 480px) {
    font-size: 0.95em;
  }
`;
export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 12px 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  font-size: 1em;
  color: #333;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    font-size: 0.95em;
  }
`;

export const InfoBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.95em;
  color: #555;
  height: 60px;
  overflow-y: auto;
  word-break: break-word;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #c1c1c1, #a5a5a5);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #9b9b9b, #7a7a7a);
  }

  &:hover {
    border-color: #d1d5db;
    background: #f3f4f6;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    max-height: 80px;
  }
`;

export const CreatedAt = styled.div`
  margin-top: 10px;
  text-align: right;
  font-size: 0.85em;
  color: #666;

  @media (max-width: 480px) {
    text-align: left;
    font-size: 0.8em;
  }
`;
