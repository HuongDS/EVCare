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
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 12px 18px;
    margin: 12px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px 15px;
    margin: 10px auto;
    width: 95%;
    border-radius: 8px;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  row-gap: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 0.4rem;
  }
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
    font-size: 0.95em;
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

  @media (max-width: 768px) {
    font-size: 0.95em;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
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
    gap: 1.5em;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25em;
  }

  @media (max-width: 480px) {
    gap: 1em;
    margin-top: 12px;
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
    grid-column: span 1;
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

  @media (max-width: 480px) {
    font-size: 0.9em;
  }
`;

export const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8em;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.6em;
  }

  @media (max-width: 480px) {
    gap: 0.5em;
  }
`;

export const ListService = styled.div`
  max-width: 20em;
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* track ẩn để gọn gàng */
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #c1c1c1, #a5a5a5);
    border-radius: 4px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #9b9b9b, #7a7a7a);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 5.5em;
  }

  @media (max-width: 480px) {
    max-height: 5em;
  }
`;

export const ListPart = styled.div`
  max-width: 20em;
  max-height: 6.2em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;

  /* Custom Scrollbar */
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

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 5em;
  }

  @media (max-width: 480px) {
    max-height: 4.5em;
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
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.7rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.6rem;
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
