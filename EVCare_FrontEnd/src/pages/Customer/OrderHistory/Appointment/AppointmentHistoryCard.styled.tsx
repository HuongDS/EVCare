import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #686868;
  border-radius: 20px;
  padding: 20px 20px;
  margin: 20px 60px;
  min-height: 180px;
  font-family: "Outfit", sans-serif;
`;

export const IDWrapper = styled.div`
  h5 {
    font-weight: bold;
  }
`;

export const GeneralStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f1f1f1;
  padding: 8px 8px;
  border-radius: 10px;
  h5 {
    margin: 0;
    font-weight: bold;
  }
  @media (max-width: 889px) {
    h5 {
      font-size: 15px;
    }
  }
`;

export const DateStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 20%;
  h5 {
    margin: 0;
    font-weight: bold;
    span {
      color: #00ad4e;
    }
  }

  @media (min-width: 768px) and (max-width: 1430px) {
    width: 50%;
  }
  @media (max-width: 889px) {
    width: 50%;

    h5 {
      font-size: 15px;
    }
    div {
      display: none;
    }
  }
`;

export const ImageWrapper = styled.div`
  img {
    width: 200px;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 10px;
`;

export const CustomerInformation = styled.div`
  width: 40%;
  display: flex;
  justify-content: space-between;
  @media (min-width: 890px) and (max-width: 1430px) {
    width: 50%;
  }
`;

export const ServiceWrapper = styled.div`
  h5 {
    font-weight: bold;
  }

  @media (max-width: 889px) {
    display: none;
  }
`;

export const ButtonStyle = styled.div`
  display: flex;
  align-items: center;
`;

export const ListItem = styled.div`
  font-size: 18px;
  font-weight: 500;
  font-family: "Outfit", sans-serif;
  margin-top: 5px;
`;
