import React from "react";
import styled from "styled-components";

interface PaginationProps {
  pageIndex: number;
  totalPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const PaginationContainer = styled.div<{ $hidden: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 5px;
  flex-wrap: wrap;
  display: ${({ $hidden }) => ($hidden ? "none" : null)};
`;

const Button = styled.button<{ $active?: boolean; $disabled?: boolean }>`
  min-width: 48px;
  height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  background-color: ${(props) => {
    if (props.$active) return "#22c55e";
    if (props.$disabled) return "#f3f4f6";
    return "white";
  }};
  color: ${(props) => {
    if (props.$active) return "white";
    if (props.$disabled) return "#9ca3af";
    return "#374151";
  }};
  border: 2px solid
    ${(props) => {
      if (props.$active) return "#22c55e";
      if (props.$disabled) return "#e5e7eb";
      return "#e5e7eb";
    }};
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    ${(props) =>
      !props.$disabled &&
      !props.$active &&
      `
      background-color: #f9fafb;
      border-color: #22c55e;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `}
  }

  &:active {
    ${(props) =>
      !props.$disabled &&
      `
      transform: translateY(0);
    `}
  }

  @media (max-width: 640px) {
    min-width: 40px;
    height: 40px;
    font-size: 14px;
    padding: 0 12px;
  }
`;

const NavButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;

  @media (max-width: 640px) {
    span {
      display: none;
    }
  }
`;

const Ellipsis = styled.span`
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 640px) {
    min-width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

export const Pagination: React.FC<PaginationProps> = ({
  pageIndex,
  pageSize,
  totalItems,
  totalPage,
  onPageChange,
}) => {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const showEllipsisStart = pageIndex > 3;
    const showEllipsisEnd = pageIndex < totalPage - 2;

    pages.push(1);

    if (showEllipsisStart) {
      pages.push("...");
    }

    for (
      let i = Math.max(2, pageIndex - 1);
      i <= Math.min(totalPage - 1, pageIndex + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPage) {
        pages.push(i);
      }
    }

    if (showEllipsisEnd) {
      pages.push("...");
    }

    if (totalPage > 1) {
      pages.push(totalPage);
    }

    return pages;
  };

  const handlePrevious = () => {
    if (pageIndex > 1) {
      onPageChange(pageIndex - 1);
    }
  };

  const handleNext = () => {
    if (pageIndex < totalPage) {
      onPageChange(pageIndex + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <PaginationContainer $hidden={totalItems <= pageSize}>
      <NavButton
        onClick={handlePrevious}
        $disabled={pageIndex === 1}
        aria-label="Previous page"
      >
        <span>←</span>
        <span>Previous</span>
      </NavButton>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>;
        }

        return (
          <Button
            key={page}
            onClick={() => handlePageClick(page as number)}
            $active={page === pageIndex}
            aria-label={`Page ${page}`}
            aria-current={page === pageIndex ? "page" : undefined}
          >
            {page}
          </Button>
        );
      })}

      <NavButton
        onClick={handleNext}
        $disabled={pageIndex === totalPage}
        aria-label="Next page"
      >
        <span>Next</span>
        <span>→</span>
      </NavButton>
    </PaginationContainer>
  );
};
