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

  /* 📱 Responsive cho mobile, ví dụ iPhone 14 Pro Max */
  @media (max-width: 480px) {
    max-width: 90%; /* rộng hơn so với 250px */
    margin: 0 auto; /* căn giữa card */
    border-radius: 10px; /* bo tròn nhẹ hơn */

    &:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
    }
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

  /* 📱 Responsive cho mobile */
  @media (max-width: 480px) {
    height: 140px; /* thấp hơn một chút để vừa màn hình */
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

  /* 📱 Responsive cho mobile */
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
`;
