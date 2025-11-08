import { Avatar, Button, Card, Tag } from "antd";
import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #778be4 0%, #d7ffdf 30%);
  padding: 2rem;

  * {
    font-family: "Outfit", sans-serif;
  }
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
`;

export const WelcomeSection = styled.div`
  color: white;
  margin-bottom: 2rem;

  h1 {
    color: white;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: none;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  .ant-card-body {
    padding: 2rem;
  }
`;

export const ProfileCard = styled(StyledCard)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    border-radius: 20px 20px 0 0;
  }
`;

export const ProfileHeader = styled.div`
  position: relative;
  text-align: center;
  margin-top: 5%;
`;

export const StyledAvatar = styled(Avatar)`
  border: 5px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  margin-top: -40px;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9ff;
  border-radius: 12px;
  color: #4b5563;
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:hover {
    background: #eff6ff;
    transform: translateX(5px);
  }

  svg {
    color: #667eea;
    flex-shrink: 0;
  }

  span:first-of-type {
    font-weight: 600;
    color: #374151;
  }
`;

export const RoleTag = styled(Tag)`
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 1rem 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`;

export const StatBox = styled.div<{
  $type: "primary" | "success" | "warning" | "info";
}>`
  background: ${({ $type }) =>
    ({
      primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      success: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      warning: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      info: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    }[$type])};
  padding: 1.5rem;
  border-radius: 16px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
    transition: all 0.5s ease;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    &::before {
      top: -100%;
      right: -100%;
    }
  }

  .ant-statistic-title {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .ant-statistic-content {
    color: white;
    font-weight: 700;
    font-size: 1.8rem;
  }

  svg {
    opacity: 0.9;
  }
`;

export const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  th,
  td {
    padding: 1rem 1.25rem;
    text-align: left;
  }

  th {
    font-weight: 600;
    color: #6b7280;
    background: #f9fafb;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e5e7eb;
  }

  tbody tr {
    transition: all 0.3s ease;
    border-bottom: 1px solid #f3f4f6;

    &:hover {
      background: #f9fafb;
      transform: scale(1.01);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  td {
    font-size: 0.95rem;
    color: #374151;
  }
`;

export const StyledButton = styled(Button as any)`
  border-radius: 12px;
  height: 45px;
  font-weight: 600;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  }
`;

export const ServiceTag = styled(Tag)`
  border-radius: 8px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  border: none;
  background: #eff6ff;
  color: #3b82f6;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
`;
