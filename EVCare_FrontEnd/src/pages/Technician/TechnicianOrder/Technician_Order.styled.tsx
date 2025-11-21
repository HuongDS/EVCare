import styled from "styled-components";

export const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 24px 20px;
  font-family: "Outfit", sans-serif;
`;

export const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    color: #00ad4e;
    background: #f1f8f4;
    transform: translateX(-4px);
  }

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 968px) {
    justify-content: center;
  }
`;

export const HeaderIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
`;

export const HeaderText = styled.div``;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 4px 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

export const CartButton = styled.button<{ $hasItems: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: ${(props) => (props.$hasItems ? "linear-gradient(135deg, #00ad4e 0%, #00c853 100%)" : "#f5f5f5")};
  color: ${(props) => (props.$hasItems ? "white" : "#999")};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.$hasItems ? "0 4px 12px rgba(0, 173, 78, 0.3)" : "none")};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }
`;

export const CartBadge = styled.div<{ $show: boolean }>`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 24px;
  height: 24px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  display: ${(props) => (props.$show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.4);
`;

export const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  font-family: "Outfit", sans-serif;
  color: #333;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
`;

export const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  svg {
    color: #00ad4e;
    margin-bottom: 20px;
  }
`;

export const EmptyText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
`;

export const EmptyHint = styled.div`
  font-size: 14px;
  color: #666;
`;

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const EVCareGreen = "#00ad4e";

export const ServiceToggleButton = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #f5f5f5;
  color: #999;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    background: #e0e0e0;
    color: ${EVCareGreen};
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.2);
  }

  @media (max-width: 968px) {
    width: 100%;
    justify-content: center;
  }
`;

export const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
  z-index: 1000;
`;

export const SidebarWrapper = styled.aside<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease-in-out;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  font-family: "Outfit", sans-serif;
`;

export const SidebarHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    color: ${EVCareGreen};
    font-size: 1.25rem;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    &:hover {
      color: #333;
    }
  }
`;

export const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex-grow: 1;
`;

export const ServiceItem = styled.li<{ $isActive: boolean }>`
  padding: 16px 24px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: ${(props) => (props.$isActive ? "600" : "400")};
  color: ${(props) => (props.$isActive ? EVCareGreen : "#333")};
  background: ${(props) => (props.$isActive ? "#e8f5e9" : "transparent")};
  border-right: 4px solid ${(props) => (props.$isActive ? EVCareGreen : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background: #f1f8e9;
  }
`;

export const LoadingSpinner = styled.div`
  font-size: 1rem;
  text-align: center;
  padding: 40px;
`;
