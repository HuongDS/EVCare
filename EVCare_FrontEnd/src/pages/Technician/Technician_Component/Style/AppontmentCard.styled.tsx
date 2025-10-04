import styled from "styled-components";

export const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  margin: 15px;
  padding: 10px 20px;
  font-family: "outfit", sans-serif;
`;
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const AppointmentID = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;

  font-size: 1.2em;
  font-weight: bold;
  span {
    font-weight: 500;
  }
`;

export const AppointmentDate = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 1rem;
  font-size: 19px;
`;
export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8em;
`;
export const Title = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  padding-bottom: 5px;
  grid-column: span 5;
`;
export const Info = styled.div`
  font-size: 1em;
  max-height: 130px;
`;

export const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;
export const ListService = styled.div`
  max-width: 20em;
  max-height: 6em;
  overflow: auto;
  margin-top: 8px;
`;

export const ButtonStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
