import styled from "styled-components";

export const Title = styled.h2`
  display: flex;
  justify-content: center;
  font-family: "Outfit", sans-serif;
  font-weight: 800;
  font-size: 2.75rem;
  padding: 20px 0;
  margin-bottom: 10px;

  background: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 10px 0;
    margin-bottom: 5px;
  }
`;
