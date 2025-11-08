import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../context/useNotification";

import { updateOrderParts } from "../services/updateOrderPartApi";
import { getAllParts } from "../services/partApi";
import { useGetTechnicianAppointments } from "../services/appointmentTechnicianApi";
import { updateAppointmentPartCondition } from "../services/appointmentPartCondition";
import { getTechnicianAddedParts } from "../services/getTechnicianOrder";

import type { OrderPartsResponseDto } from "../models/OrderPartModel/Order_Parts_Model";
import type { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
import type { TechnicianAppointmentsDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../models/enums";

import { LENGTH } from "../constants/Code/Constants";

interface UseTechnicianOrderProps {
  propOrderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory?: string;
}

export const useTechnicianOrder = ({
  propOrderId,
  onPartsUpdated,
  selectedCategory,
}: UseTechnicianOrderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();

  const stateOrderId = (location.state as { orderId?: number })?.orderId;
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

  // Query hooks
  const {
    data: technicianPartsRes,
    isLoading: isPartsLoading,
    refetch: refetchTechnicianParts,
  } = getTechnicianAddedParts(currentOrderId ?? 0);

  const { data: appointmentRes } = useGetTechnicianAppointments({
    Status: "AddingPart" as TechnicianWorkingSessionEnum,
    PageSize: 1000,
    PageIndex: 1,
  });

  // Fetch all parts
  useEffect(() => {
    const fetchAllParts = async () => {
      if (!currentOrderId) return;
      setIsLoading(true);
      try {
        const partsRes = await getAllParts({ pageIndex: 1, pageSize: 1000 });
        setAllParts(partsRes.items ?? []);

        const appointment = appointmentRes?.items?.find(
          (a: TechnicianAppointmentsDto) => a.orderId === currentOrderId
        );
        if (appointment) setAppointmentId(appointment.id);
      } catch (err) {
        console.error("Failed to fetch parts or appointment", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllParts();
  }, [currentOrderId, appointmentRes]);

  // Load parts added by technician
  useEffect(() => {
    if (technicianPartsRes?.data) {
      const mappedCart =
        technicianPartsRes.data.map((p) => ({
          part: {
            id: p.partID,
            name: p.partName,
            price: p.price,
            quantity: p.quantity,
          } as OrderPartsResponseDto,
          quantity: p.quantity,
        })) ?? [];
      setCart(mappedCart);
    }
  }, [technicianPartsRes]);

  // Pagination & search
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

  // === Cart logic ===
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

  // === API update logic ===
  const handleSendCart = async (
    damageLevels: Record<number, DamageLevelEnum>
  ) => {
    if (!currentOrderId || !appointmentId || isSending) return;
    setIsSending(true);
    try {
      await Promise.all([
        updateOrderParts({
          orderId: currentOrderId,
          parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
        }),
        updateAppointmentPartCondition({
          appointmentId,
          partDamageLevels: Object.entries(damageLevels).map(([id, level]) => ({
            partId: Number(id),
            levelEnum: level,
          })),
        }),
      ]);
      notification.success({
        message: "Update Successful",
        description: "Parts and damage levels updated successfully!",
        showProgress: true,
      });
      onPartsUpdated?.(currentOrderId);
      setCartOpen(false);
      refetchTechnicianParts();
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
  const handleProductCardClick = (part: OrderPartsResponseDto) => {
    if (part.isDeleted || part.quantity <= 0) return;
    setSelectedPart(part);
    setOpen(true);
  };
  // Expose to component
  return {
    cart,
    displayParts,
    page,
    totalPages,
    searchQuery,
    isLoading: isLoading || isPartsLoading,
    isSending,
    pageSize,
    open,
    selectedPart,
    cartOpen,

    setIsSending,
    setCart,
    setOpen,
    setCartOpen,
    setPage,
    setSearchQuery,
    setSelectedPart,
    handleAddToCart,
    handleRemoveFromCart,
    handleSendCart,
    handleBack,
    handleProductCardClick,
  };
};
