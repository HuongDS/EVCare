import styled from "styled-components";

export const CardContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 250px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-6px) scale(1.03);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  transition: transform 0.35s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

export const Info = styled.div`
  padding: 12px 16px;
  text-align: center;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: color 0.3s ease;

  ${CardContainer}:hover & {
    color: #111;
  }
`;
