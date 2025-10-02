import styled from "styled-components";

export const CardContainer = styled.button`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;

  width: 190px;
  height: 254px;
  background: #fff;
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(2%);
  border-radius: 17px;

  text-align: center;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bold;
  color: black;
  transition: all 0.3s ease;

  &:hover {
    border: 1px solid black;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95) rotateZ(1.7deg);
  }

  /* responsive */
  @media (max-width: 600px) {
    width: 150px;
    height: 220px;
  }
`;

export const Image = styled.img`
  width: 80%;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  background-color: #f3f3f3;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    height: 80px;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
