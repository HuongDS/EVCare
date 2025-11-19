import React from "react";
import styled from "styled-components";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface MinimalPaginationProps {
  pageIndex: number;
  totalPage: number;
  onPageChange: (page: number) => void;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 4px 0;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #00ad4e;
  font-size: 12px;

  &:hover:not(:disabled) {
    background-color: rgba(0, 173, 78, 0.1);
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    color: #d1d5db;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-family: "Outfit", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  user-select: none;
`;

export const MinimalPagination: React.FC<MinimalPaginationProps> = ({ pageIndex, totalPage, onPageChange }) => {
  const handlePrev = () => {
    if (pageIndex > 1) onPageChange(pageIndex - 1);
  };

  const handleNext = () => {
    if (pageIndex < totalPage) onPageChange(pageIndex + 1);
  };

  if (totalPage <= 1) return null;

  return (
    <Container>
      <NavButton onClick={handlePrev} disabled={pageIndex === 1}>
        <LeftOutlined />
      </NavButton>

      <PageInfo>
        {pageIndex} / {totalPage}
      </PageInfo>

      <NavButton onClick={handleNext} disabled={pageIndex === totalPage}>
        <RightOutlined />
      </NavButton>
    </Container>
  );
};
