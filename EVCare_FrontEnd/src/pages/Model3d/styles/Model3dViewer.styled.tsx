import styled from "styled-components";

export const PopupStyled = styled.div`
  position: fixed;
  bottom: 20px;
  left: 65%;
  transform: translateX(-50%);
  width: 320px;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999;
  font-family: "Outfit", sans-serif;
  color: #333;

  h3 {
    margin: 0;
    color: #00ad4e;
    font-size: 18px;
    font-weight: 600;
  }

  p {
    margin: 6px 0;
    font-size: 14px;
  }
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
`;

export const LeftPanel = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(59, 130, 246, 0.5) 50%,
      transparent
    );
  }

  @media (max-width: 1024px) {
    flex: 0 0 45%;
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease-in-out;
  }
`;

export const RightPanel = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  background: #0a0f1e;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: 50;
`;

export const LoadingContent = styled.div`
  text-align: center;
  color: #e2e8f0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: "Outfit", sans-serif;
  color: #ef4444;
  text-align: center;
  padding: 32px;
`;

export const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
`;

export const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  /* position: relative; */
  /* right: 5%; */
  canvas {
    outline: none;
  }
`;
