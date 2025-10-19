import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";
import SearchBar from "../Technician_Component/SearchBar";
import ImageSkeleton from "../Technician_Component/ImageSkeleton";

import { getAllParts } from "../../../services/partApi";
import { updateOrderParts } from "../../../services/updateOrderPartApi";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";

import type {
  OrderPartsResponseDto,
  UpdateOrderPartDto,
} from "../../../models/OrderPartModel/Order_Parts_Model";

import {
  PageContainer,
  TitleContainer,
  Title,
  CardWrapper,
  CenterWrapper,
  PaginationContainer,
  SearchWrapper,
  ContentWrapper,
} from "./Technician_Order.styled";

import { LENGTH } from "../../../constants/Code/Constants";
import ButtonAction from "../../../components/Button/ReviewButton";

interface TechnicianOrderProps {
  orderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory?: string;
}

// API trả về parts trong appointment
interface PartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface AppointmentItem {
  orderId: number;
  parts: PartItem[];
}

export default function TechnicianOrder({
  orderId: propOrderId,
  onPartsUpdated,
  selectedCategory,
}: TechnicianOrderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const stateOrderId = (location.state as { orderId: number })?.orderId;

  const [currentOrderId, setCurrentOrderId] = useState<number | null>(
    propOrderId ?? stateOrderId ?? null
  );

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
    if (stateOrderId) setCurrentOrderId(stateOrderId);
  }, [stateOrderId]);

  /** Lấy tất cả parts */
  const fetchParts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllParts({ pageIndex: 1, pageSize: 1000 });
      setAllParts(data.items);
    } catch (err) {
      console.error("Failed to fetch parts", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParts();
  }, [fetchParts]);

  /** Lấy parts đã có trong order */
  const fetchExistingOrderParts = useCallback(async () => {
    if (!currentOrderId) return;
    try {
      const res = await getTechnicianAppointments({ Status: "AddingPart" });

      // ✅ Nếu API không trả về items
      if (!res.items || res.items.length === 0) {
        setCart([]);
        return;
      }

      const appointment = res.items.find(
        (a: AppointmentItem) => a.orderId === currentOrderId
      );

      if (appointment?.parts) {
        const mappedCart = appointment.parts.map((p) => ({
          part: {
            id: p.id,
            name: p.name,
            price: p.price,
            imageUrl: p.imageUrl,
            quantity: p.quantity,
            categoryId: 0,
            isDeleted: false,
          } as OrderPartsResponseDto,
          quantity: p.quantity,
        }));

        setCart(mappedCart);
      } else {
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to load existing order parts", err);
      setCart([]);
    }
  }, [currentOrderId]);

  useEffect(() => {
    if (currentOrderId) fetchExistingOrderParts();
  }, [currentOrderId, fetchExistingOrderParts]);

  const updateDisplayParts = useCallback(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = allParts.filter(
      (p) =>
        p.quantity > 0 &&
        (query === "" || p.name.toLowerCase().includes(query)) &&
        (selectedCategory ? p.categoryId === Number(selectedCategory) : true)
    );

    setTotalPages(Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    setDisplayParts(filtered.slice(start, start + pageSize));
  }, [allParts, searchQuery, page, pageSize, selectedCategory]);

  useEffect(() => {
    updateDisplayParts();
  }, [updateDisplayParts]);

  /** Thêm part vào giỏ */
  const handleAddToCart = (part: OrderPartsResponseDto, quantity: number) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.part.id === part.id);
      if (exist) {
        return prev.map((item) =>
          item.part.id === part.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { part, quantity }];
    });
    setCartOpen(true);
  };

  /** Xoá part khỏi giỏ */
  const handleRemoveFromCart = (partId: number) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };
  const [isSending, setIsSending] = useState(false);
  /** Gửi giỏ lên server */
  const handleSendCart = async () => {
    if (!currentOrderId || isSending) return;

    setIsSending(true);
    const payload: UpdateOrderPartDto = {
      orderId: currentOrderId,
      parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
    };

    try {
      await updateOrderParts(payload);
      onPartsUpdated?.(currentOrderId);
      alert("✅ Order parts updated successfully!");

      // Đóng modal
      setCartOpen(false);

      navigate("/technician", { state: { tab: "ADDING_PART" } });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update order parts");
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <PageContainer>
      <TitleContainer>
        <ButtonAction
          text="← Back"
          color="white"
          backgroundColor="#888"
          action={handleBack}
        />

        <CenterWrapper>
          <Title>Technician Order</Title>
          <SearchWrapper>
            <SearchBar
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search for parts..."
            />
          </SearchWrapper>
        </CenterWrapper>

        <ButtonAction
          text={`Open Cart (${cart.length})`}
          color="white"
          backgroundColor="#00AD4E"
          action={() => setCartOpen(true)}
        />
      </TitleContainer>
      <ContentWrapper>
        <CardWrapper>
          {isLoading
            ? Array.from({ length: pageSize }).map((_, idx) => (
                <div key={idx} style={{ width: "200px", margin: "0.5rem" }}>
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
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </PaginationContainer>
      </ContentWrapper>

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
        onQuantityChange={(id, qty) =>
          setCart((prev) =>
            prev.map((item) =>
              item.part.id === id ? { ...item, quantity: qty } : item
            )
          )
        }
        onRemove={handleRemoveFromCart}
        onSend={handleSendCart}
        loading={isSending}
      />
    </PageContainer>
  );
}
