import styled from "styled-components";

export const ContactWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 5rem 5%;
  background: linear-gradient(to bottom, #f9fff8 0%, #ffffff 100%);
  min-height: 90vh;
`;

export const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 250px;
`;

export const RightColumns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 300px;

  iframe {
    width: 100%;
    height: 400px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    border: 1px solid #eef2f7;
  }
`;

export const TopRightColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eef2f7;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 173, 78, 0.15);
  }
`;

export const Title = styled.h1`
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #00c656 0%, #00ad4e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 900px) {
    text-align: center;
    align-self: center;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #1e293b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  i {
    color: #00ad4e;
    font-size: 1.1rem;
    background: #e6f7ee;
    padding: 10px;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ContactInfo = styled.p`
  font-size: 1rem;
  color: #475569;
  font-weight: 500;
  margin: 0;
`;

export const ContactContent = styled.p`
  font-size: 1.15rem;
  color: #475569;
  line-height: 1.7;
  margin-bottom: 20px;
  text-align: left;

  @media (max-width: 900px) {
    text-align: center;
  }
`;
