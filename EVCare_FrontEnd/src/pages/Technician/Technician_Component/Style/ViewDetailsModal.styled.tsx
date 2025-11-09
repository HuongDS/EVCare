import styled from "styled-components";

export const ModalContainer = styled.div`
  font-family: "Outfit", sans-serif;
  border-radius: 12px;
  padding: 20px 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #00ad4e;
    margin: 0;
  }
`;

export const MainGrid = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 24px;
  height: 100%;
`;

export const InfoSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  font-size: 0.9rem;
  margin-bottom: 6px;

  span.label {
    display: inline-block;
    min-width: 120px;
    color: #555;
    font-weight: 500;
  }
`;

export const ListSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2 cột: Services - Parts */
  gap: 24px;
  min-height: 200px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ListBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background: #fafafa;
  padding: 12px;
  overflow: hidden;
`;

export const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 10px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
`;

export const SubTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 400;
  color: #777;
`;

export const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 220px;

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    font-size: 0.9rem;
    padding: 6px 0;
    border-bottom: 1px solid #f1f1f1;
  }

  li:last-child {
    border-bottom: none;
  }

  .empty {
    font-size: 0.9rem;
    color: #888;
    text-align: center;
    padding: 8px 0;
  }

  /* Scroll bar gọn */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d0d0d0;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;
