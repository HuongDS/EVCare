import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  margin: 20px auto;
  min-height: 310px;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #eaeef3;
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s ease-in-out;

  @media (max-width: 889px) {
    margin: 16px 16px;
    padding: 16px;
  }
`;

export const IDWrapper = styled.div`
  h5 {
    font-weight: 600; /* Đậm vừa */
    font-size: 15px;
    color: #555e68;
    margin-bottom: 12px;

    span {
      color: #00ad4e; /* Màu chủ đạo */
      font-weight: 700;
      background-color: #e6f7ee; /* Nền xanh lá rất nhạt */
      padding: 3px 10px;
      border-radius: 6px;
      margin-left: 4px;
    }
  }
`;

// --- (Chỉnh sửa) ---
// Bỏ thanh xám, thay bằng đường kẻ
export const GeneralStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Bỏ background-color: #f1f1f1; */
  padding: 12px 0; /* Chỉ cần padding trên dưới */
  border-top: 1px solid #f0f2f5; /* Đường kẻ mờ */
  border-bottom: 1px solid #f0f2f5; /* Đường kẻ mờ */
  margin-bottom: 16px;

  h5 {
    margin: 0;
    font-weight: 600;
    font-size: 1.1rem; /* Cho tên xe to rõ */
    color: #1a202c; /* Màu text chính */
  }
  @media (max-width: 889px) {
    h5 {
      font-size: 1rem;
    }
  }
`;

// --- (Chỉnh sửa) ---
// Tinh chỉnh lại khoảng cách
export const DateStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 16px; /* Dùng 'gap' thay cho width cố định */

  h5 {
    margin: 0;
    font-weight: 500;
    font-size: 0.95rem;
    color: #4a5568; /* Màu text phụ */

    span {
      color: #00ad4e; /* Giữ màu chủ đạo */
      font-weight: 600;
    }
  }

  /* Giữ nguyên media query của bạn, rất tốt! */
  @media (min-width: 768px) and (max-width: 1430px) {
    /* width: 50%; (Không cần nữa vì đã dùng gap) */
  }
  @media (max-width: 889px) {
    /* width: 50%; (Không cần nữa) */
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
    border-radius: 12px; /* Đồng bộ bo góc */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    transition: transform 0.3s ease;
  }

  ${Container}:hover & img {
    transform: scale(1.03);
  }

  @media (max-width: 889px) {
    img {
      width: 150px;
      height: 110px;
    }
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0;
  gap: 24px;

  @media (max-width: 889px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const CustomerInformation = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;

  @media (min-width: 890px) and (max-width: 1430px) {
  }
  @media (max-width: 889px) {
    width: 100%;
  }
`;

export const ServiceWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  @media (max-width: 889px) {
    display: none;
  }
`;

export const ButtonStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;

  & > div {
    margin-left: 0 !important;
  }

  @media (max-width: 889px) {
    justify-content: flex-start;
  }
`;

export const ListItem = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  color: #008a3e;
  background-color: #e6f7ee;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #b6e6c9;
  white-space: nowrap;

  &::before {
    content: none;
  }
`;
