import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";

import { getAllParts } from "../../../services/partApi";
import { addPartsToOrder } from "../../../services/addPartOrderApi";
import { getAccountInformation } from "../../../services/accountService";

import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import type { AddPartsRequest } from "../../../models/OrderPartModel/OrderPartAddTechnician";

import {
  PageContainer,
  Title,
  CardWrapper,
  PaginationContainer,
  TitleContainer,
} from "./Technician_Order.styled";

import SearchBar from "../Technician_Component/SearchBar";
import ImageSkeleton from "../Technician_Component/ImageSkeleton";
import { LENGTH } from "../../../constants/Code/Constants";

interface TechnicianOrderProps {
  orderId?: number;
  onPartsUpdated?: (orderId: number) => void;
}

export default function TechnicianOrder({
  orderId: propOrderId,
  onPartsUpdated,
}: TechnicianOrderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateOrderId = (location.state as { orderId: number })?.orderId;

  const [currentOrderId, setCurrentOrderId] = useState<number | null>(
    propOrderId ?? stateOrderId ?? null
  );
  const [technicianId, setTechnicianId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<OrderPartsResponseDto | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<
    { part: OrderPartsResponseDto; quantity: number }[]
  >([]);
  const [allParts, setAllParts] = useState<OrderPartsResponseDto[]>([]);
  const [displayParts, setDisplayParts] = useState<OrderPartsResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = LENGTH.VIEW_PARTCARD_MAX;

  useEffect(() => {
    if (propOrderId) setCurrentOrderId(propOrderId);
  }, [propOrderId]);

  useEffect(() => {
    const stateId = (location.state as { orderId: number })?.orderId;
    if (stateId) setCurrentOrderId(stateId);
  }, [location.state]);

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const res = await getAccountInformation();
        if (res.statusCode === 200 && res.data) setTechnicianId(res.data.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTechnician();
  }, []);

  const fetchParts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllParts({ pageIndex: 1, pageSize: 1000 });
      setAllParts(data.items);
    } catch (error) {
      console.error(error);
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

  const handleAddToCart = (part: OrderPartsResponseDto, quantity: number) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.part.id === part.id);
      if (exist)
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      return [...prev, { part, quantity }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (partId: number) => {
    setCart(cart.filter((c) => c.part.id !== partId));
  };

  const handleSendCart = async () => {
    if (!currentOrderId || !technicianId || cart.length === 0) return;
    const request: AddPartsRequest = {
      orderId: currentOrderId,
      listParts: cart.map((c) => ({
        partID: c.part.id,
        orderId: currentOrderId,
        technicianId,
        quantity: c.quantity,
      })),
    };
    try {
      await addPartsToOrder(request);
      setCart([]);
      setCartOpen(false);
      onPartsUpdated?.(currentOrderId); // 🔹 callback chỉ cho orderId hiện tại
    } catch (error) {
      console.error(error);
      alert("Failed to send parts");
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <PageContainer>
      <TitleContainer>
        <Title>Technician Order</Title>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleBack}
            style={{
              padding: "8px 12px",
              backgroundColor: "#555",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <SearchBar
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search for parts..."
          />
          <button
            onClick={() => setCartOpen(true)}
            style={{
              padding: "8px 12px",
              backgroundColor: "#00AD4E",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Open Cart ({cart.length})
          </button>
        </div>
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
                <ImageSkeleton alt="loading" height={150} />
              </div>
            ))
          : displayParts.map((part) => (
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
        onAddToCart={handleAddToCart}
      />
      <CartModal
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={handleRemoveFromCart}
        onSend={handleSendCart}
      />
    </PageContainer>
  );
}
