import styled from "styled-components";

export const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin: 15px;
  padding: 15px 25px;
  font-family: "Outfit", sans-serif;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  min-width: 0;

  @media (max-width: 768px) {
    padding: 12px 15px;
    margin: 10px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;
`;

export const AppointmentID = styled.div`
  display: flex;
  column-gap: 1rem;
  font-size: 1.2em;
  font-weight: bold;
  color: #333;

  span {
    font-weight: 500;
    color: #555;
  }

  @media (max-width: 768px) {
    font-size: 1em;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    row-gap: 0.3rem;
  }
`;

export const AppointmentDate = styled.div`
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
  font-size: 1rem;
  color: #555;

  i {
    font-size: 1.2em;
    color: #777;
  }

  @media (max-width: 480px) {
    justify-content: flex-start;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2em;
  margin-top: 15px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5em;
  }
`;

export const Title = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  padding-bottom: 5px;
  grid-column: span 3;
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.3em;
  }

  @media (max-width: 480px) {
    font-size: 1.1em;
  }
`;

export const Info = styled.div`
  font-size: 1em;
  max-height: 130px;
  word-break: break-word;
  color: #555;

  @media (max-width: 768px) {
    font-size: 0.95em;
  }
`;

export const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8em;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5em;
  }
`;

export const ListService = styled.div`
  max-width: 20em;
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const ListPart = styled.div`
  max-width: 20em;
  max-height: 6.2em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 5em;
  }
`;

export const ButtonStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  margin-top: 10px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: flex-start;
  }
`;

export const AppointmentStatus = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  font-size: 1em;
  color: #555;

  i {
    font-size: 1.2em;
    color: green;
  }

  @media (max-width: 768px) {
    font-size: 0.95em;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
  }
`;
