import { Button, Card } from "react-bootstrap";
import styled from "styled-components";

// Styled Components
export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 2rem 0;
  font-family: "Outfit", sans-serif;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const ServiceLabel = styled.p`
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const BookButton = styled(Button)`
  background-color: #28a745;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

export const SortSection = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SortLabel = styled.span`
  color: #6c757d;
  font-weight: 600;
  margin-right: 1rem;
  align-self: center;
`;

export const SortButton = styled(Button)`
  margin: 0.25rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  ${(props) =>
    props.active
      ? `
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  `
      : `
    background-color: white;
    border-color: #dee2e6;
    color: #6c757d;
    
    &:hover {
      background-color: #e9ecef;
      border-color: #28a745;
    }
  `}
`;

export const ServiceCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

export const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export const ServiceIcon = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.color || "#6c757d"};
`;

export const ServiceTitle = styled.h5`
  font-weight: 600;
  color: #212529;
  margin-bottom: 0.75rem;
`;

export const ServiceDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

export const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  font-size: 0.85rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

export const FeatureBullet = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.color || "#6c757d"};
  margin-top: 6px;
  margin-right: 8px;
  flex-shrink: 0;
`;

export const BookServiceButton = styled(Button)`
  width: 100%;
  background-color: #f8f9fa;
  border-color: #e9ecef;
  color: #495057;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9ecef;
    border-color: #28a745;
    color: #28a745;
  }
`;

export const FooterCTA = styled.div`
  text-align: center;
  margin-top: 3rem;
`;

export const GetInTouchButton = styled(Button)`
  background-color: #28a745;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #218838;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;
