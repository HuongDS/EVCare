import styled from "styled-components";

export const RatingWrapper = styled.div`
  font-family: "Outfit", sans-serif;
  padding: 50px 0;
  display: flex;
  justify-content: center;
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
`;
export const TitleID = styled.h1`
  font-weight: 600;
  font-size: 1em;
  text-align: center;
`;

export const Button = styled.button`
  display: block;
  width: 300px;
  height: 50px;
  margin: 30px auto;
  font-family: "Outfit", sans-serif;
  font-size: 30px;
  font-weight: 600;
  color: white;
  border-radius: 20px;
  border: none;
  background-color: #00ad4e;
  cursor: pointer;

  &:hover {
    background-color: #0039a6;
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
  z-index: 1001;
`;

export const RatingModal = styled.div<{ isOpen: boolean }>`
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  display: flex;
  flex-direction: column;
  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.8)")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: all 0.3s ease;
  z-index: 1002;
  position: relative;
`;

export const Legend = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

export const RowWapper = styled.div``;
export const RowInfo = styled.div`
  display: flex;
  flex-direction: column;
`;
export const RowDateLocation = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const StaffRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 2%;
  align-items: center;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const LocationBox = styled.div`
  background: #f2f4f3;
  border-radius: 8px;
  padding: 10px 14px;
  width: 100%;
`;

export const Icon = styled.i`
  padding-right: 5%;
`;

export const ReviewBox = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-top: 8px;
  resize: vertical;
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

export const RowService = styled.div``;
export const RowReview = styled.div``;
