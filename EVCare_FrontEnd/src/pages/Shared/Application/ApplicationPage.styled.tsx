import styled from "styled-components";

export const PageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: "Outfit", sans-serif;
  gap: 30px;

  @media (max-width: 480px) {
    padding: 20px 12px;
    gap: 20px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5em;
  font-weight: 700;
  color: #16a34a;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    font-size: 1.2em;
    margin-bottom: 12px;
  }
`;

export const ApplicationsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 16px;
  }
`;

export const LoadingText = styled.p`
  font-size: 1em;
  color: #555;
  text-align: center;
`;

export const ErrorText = styled.p`
  font-size: 1em;
  color: #dc2626;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 1em;
  color: #555;
  text-align: center;
`;
