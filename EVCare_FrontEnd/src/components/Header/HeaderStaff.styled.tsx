import styled from "styled-components";

export const HeaderContainer = styled.div`
  height: 56px;
  background: #f5fffa; /* Màu nền xanh nhạt */
  border-bottom: 1px solid #eef3ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;

  /* Responsive: giảm kích thước padding và font-size khi màn hình nhỏ */
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const LogoContainer = styled.img`
  display: flex;
  align-items: center;
  max-width: 12%;
  height: auto;

  /* Responsive: giảm kích thước logo khi màn hình nhỏ */
  @media (max-width: 768px) {
    max-width: 20%;
  }
`;

export const DateContainer = styled.div`
  font-size: 1.3em;
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-weight: 1000;
  }

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;
