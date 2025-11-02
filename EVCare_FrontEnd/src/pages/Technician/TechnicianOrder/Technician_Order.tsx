import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pagination, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import CartModal from "../Technician_Component/CartModal";
import SearchBar from "../Technician_Component/SearchBar";

import { updateOrderParts } from "../../../services/updateOrderPartApi";
import { getAllParts } from "../../../services/partApi";
import { getTechnicianAppointments } from "../../../services/appointmentTechnicianApi";
import { updateAppointmentPartCondition } from "../../../services/appointmentPartCondition";

import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import type { DamageLevelEnum } from "../../../models/enums/DamageLevelEnum";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";

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
import ButtonAction from "../../../components/Button/ButtonAction";
import { useNotification } from "../../../context/useNotification";

interface TechnicianOrderProps {
  orderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory?: string;
}

export default function TechnicianOrder({
  orderId: propOrderId,
  onPartsUpdated,
  selectedCategory,
}: TechnicianOrderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const stateOrderId = (location.state as { orderId: number })?.orderId;

  const [currentOrderId] = useState<number | null>(
    propOrderId ?? stateOrderId ?? null
  );
  const [appointmentId, setAppointmentId] = useState<number | null>(null);

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
  const [isSending, setIsSending] = useState(false);

  const pageSize = LENGTH.VIEW_PARTCARD_MAX;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentOrderId) return;
      setIsLoading(true);
      try {
        const partsRes = await getAllParts({ pageIndex: 1, pageSize: 1000 });
        setAllParts(partsRes.items ?? []);
        const appointmentRes = await getTechnicianAppointments({
          Status: "AddingPart",
        });
        const appointment = appointmentRes.items?.find(
          (a: TechnicianAppointmentsDto) => a.orderId === currentOrderId
        );
        if (!appointment) return;

        setAppointmentId(appointment.id);

        const mappedCart =
          appointment.parts?.map((p) => ({
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
          })) ?? [];
        setCart(mappedCart);
      } catch (err) {
        console.error("Failed to fetch parts or appointment", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentOrderId]);

  const updateDisplayParts = useCallback(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = allParts.filter(
      (p) =>
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

  const handleRemoveFromCart = (partId: number) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const handleSendCart = async (
    damageLevels: Record<number, DamageLevelEnum>
  ) => {
    if (!currentOrderId || !appointmentId || isSending) return;
    setIsSending(true);
    try {
      await updateOrderParts({
        orderId: currentOrderId,
        parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
      });
      await updateAppointmentPartCondition({
        appointmentId,
        partDamageLevels: Object.entries(damageLevels).map(([id, level]) => ({
          partId: Number(id),
          levelEnum: level,
        })),
      });
      notification.success({
        message: "Update Successful",
        description: "Parts and damage levels updated successfully!",
        showProgress: true,
      });
      onPartsUpdated?.(currentOrderId);
      setCartOpen(false);
      navigate("/technician/my-jobs", { state: { tab: "ADDING_PART" } });
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Update Failed",
        description: "Failed to update parts or damage levels.",
        showProgress: true,
      });
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
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, idx) => (
              <ProductCard key={idx} isSkeleton />
            ))
          ) : displayParts.length > 0 ? (
            displayParts.map((part) => (
              <ProductCard
                key={part.id}
                part={part}
                onClick={() => {
                  if (part.isDeleted || part.quantity <= 0) return;
                  setSelectedPart(part);
                  setOpen(true);
                }}
              />
            ))
          ) : (
            <div
              style={{ width: "100%", textAlign: "center", padding: "2rem" }}
            >
              No parts found.
            </div>
          )}
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
