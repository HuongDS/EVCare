import styled from "styled-components";

export const Card = styled.div`
  font-family: "Outfit", sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin: 15px;
  padding: 15px 25px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5em;
  margin-top: 15px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25em;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1em;
  }
`;

export const Title = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  padding-bottom: 5px;
  color: #333;
`;

export const Info = styled.div`
  font-size: 1em;
  color: #555;
`;

export const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8em;
`;

export const ListService = styled.div`
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;
`;

export const ListPart = styled.div`
  max-height: 6em;
  overflow-y: auto;
  margin-top: 8px;
  padding-right: 4px;
`;

export const ButtonStyled = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 10px;
`;

export const AppointmentImages = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ImageItem = styled.div`
  width: 100%;
  max-height: 120px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
