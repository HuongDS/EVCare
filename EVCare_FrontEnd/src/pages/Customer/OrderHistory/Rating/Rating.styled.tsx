import styled from "styled-components";

export const DetailWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const Button = styled.button`
  display: block;
  width: 300px;
  height: 50px;
  margin: 10px auto;
  font-family: "Outfit", sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: none;
  background-color: #00ad4e;
  cursor: pointer;

  &:hover {
    background-color: #0039a6;
  }

  @media (max-width: 480px) {
    width: 220px;
    height: 45px;
    font-size: 20px;
  }
`;

export const Backdrop = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

export const Wrapper = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1001;
`;

export const OrderModal = styled.div<{ isOpen: boolean }>`
  background: #fff;
  width: 600px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 20px 40px;
  padding-right: 0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.8)")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 1002;
  box-sizing: border-box;
  scrollbar-gutter: stable;
  @media (max-width: 480px) {
    padding: 20px;
    width: 90%;
  }
`;

export const MainTitle = styled.h1`
  font-weight: 600;
  font-size: 2em;
  text-align: center;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 1.3em;
  text-align: center;
  color: #00ad4e;
`;

export const TitleID = styled.h2`
  font-weight: 800;
  font-size: 1em;
  text-align: left;
`;

export const Section = styled.div`
  margin-top: 10px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fafafa;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const StaffRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 cột bằng nhau */
  gap: 20px;
  margin-bottom: 12px;
  align-items: center;

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* stack cột khi màn hình nhỏ */
    gap: 8px;
  }
`;

export const ServiceList = styled.div`
  max-height: 130px;
  overflow-y: auto;
  margin-top: 8px;
`;

export const ServiceItemBox = styled.div`
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  font-family: "Outfit", sans-serif;
`;

export const ReviewBox = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  font-family: "Outfit", sans-serif;
`;

export const Icon = styled.i`
  margin-right: 6px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 cột bằng nhau */
  gap: 20px;
  margin-top: 10px;
  align-items: center;

  @media (max-width: 480px) {
    grid-template-columns: 1fr; /* stack cột khi màn hình nhỏ */
    gap: 10px;
  }
`;

export const LocationBox = styled.div`
  background: #f2f4f3;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: start;
  min-width: 120px;
  text-align: left;
  margin-top: 9.5%;
`;

export const ModalContent = styled.div`
  overflow-y: auto;
  max-height: 90vh;
  padding-right: 15px;
`;
