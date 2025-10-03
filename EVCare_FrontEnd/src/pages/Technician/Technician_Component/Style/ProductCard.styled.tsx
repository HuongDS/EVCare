import styled from "styled-components";

export const CardContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 250px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

export const Info = styled.div`
  padding: 12px 16px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.4;
`;
