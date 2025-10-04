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
  TitleContainer,
} from "./Technician_Order.styled";

import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { LENGTH } from "../../../constants/Code/Constants";
import SearchBar from "../Technician_Component/SearchBar";
import ImageSkeleton from "../Technician_Component/ImageSkeleton";

export default function TechnicianOrder() {
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<OrderPartsResponseDto | null>(null);

  const [allParts, setAllParts] = useState<OrderPartsResponseDto[]>([]); // dữ liệu gốc
  const [displayParts, setDisplayParts] = useState<OrderPartsResponseDto[]>([]); // hiển thị trên UI

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = LENGTH.VIEW_PARTCARD_MAX;

  const fetchParts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllParts({ pageIndex: 1, pageSize: 1000 });
      setAllParts(data.items);
    } catch (error) {
      console.error("Failed to fetch parts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  const updateDisplayParts = useCallback(() => {
    const filtered = allParts.filter((part) =>
      part.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTotalPages(Math.ceil(filtered.length / pageSize));

    const startIndex = (page - 1) * pageSize;
    setDisplayParts(filtered.slice(startIndex, startIndex + pageSize));
  }, [allParts, searchQuery, page, pageSize]);

  useEffect(() => {
    updateDisplayParts();
  }, [updateDisplayParts]);

  const handleOpenModal = (part: OrderPartsResponseDto) => {
    setSelectedPart(part);
    setOpen(true);
  };

  return (
    <PageContainer>
      <TitleContainer>
        <Title>Technician Order</Title>

        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // reset page khi search
          }}
          placeholder="Search for parts..."
        />
      </TitleContainer>

      <CardWrapper>
        {isLoading
          ? Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "200px",
                  margin: "0.5rem",
                  borderRadius: "8px",
                }}
              >
                <ImageSkeleton src="" alt="loading" height={150} />
              </div>
            ))
          : displayParts.map((part) => (
              <ProductCard
                key={part.id}
                part={part}
                onClick={() => handleOpenModal(part)}
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
