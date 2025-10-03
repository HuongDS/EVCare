import { useEffect, useState, useCallback } from "react";
import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import { getAllParts } from "../../../services/partApi";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

import {
  PageContainer,
  Title,
  CardWrapper,
  PaginationContainer,
} from "./Technician_Order.styled";

import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function TechnicianOrder() {
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<OrderPartsResponseDto | null>(null);

  const [parts, setParts] = useState<OrderPartsResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // mặc định mỗi trang trả về 20 card
  const pageSize = 20;

  /**
   * Sử dụng useCallback để tránh tạo lại hàm fetchParts sau mỗi lần render
   */
  const fetchParts = useCallback(
    async (pageIndex: number) => {
      try {
        const data = await getAllParts({ pageIndex, pageSize });
        setParts(data.items);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      }
    },
    [pageSize] // chỉ phụ thuộc vào pageSize
  );

  /**
   * Mỗi khi page thay đổi, gọi lại fetchParts
   */
  useEffect(() => {
    fetchParts(page);
  }, [page, fetchParts]);

  return (
    <PageContainer>
      <Title>Technician Order</Title>

      <CardWrapper>
        {parts.map((part) => (
          <ProductCard
            key={part.id}
            part={part}
            onClick={() => {
              setSelectedPart(part);
              setOpen(true);
            }}
          />
        ))}
      </CardWrapper>

      <PaginationContainer>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </PaginationContainer>

      <ProductModal
        open={open}
        onClose={() => setOpen(false)}
        part={selectedPart}
      />
    </PageContainer>
  );
}
