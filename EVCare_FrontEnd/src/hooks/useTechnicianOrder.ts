// src/hooks/useTechnicianOrder.ts
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../context/useNotification";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateOrderParts } from "../services/updateOrderPartApi";
import { useGetAllParts } from "../services/partApi";
import { useUpdatePartCondition } from "../services/appointmentPartCondition";
// import { getTechnicianAddedParts } from "../services/getTechnicianOrder";

import type { OrderPartsResponseDto } from "../models/OrderPartModel/Order_Parts_Model";
import type { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
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
  const queryClient = useQueryClient();

  const stateOrderId = (location.state as { orderId?: number })?.orderId;
  const [currentOrderId] = useState<number | null>(
    propOrderId ?? stateOrderId ?? null
  );

  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<OrderPartsResponseDto | null>(null);
  const [page, setPage] = useState(1);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<
    { part: OrderPartsResponseDto; quantity: number }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = LENGTH.VIEW_PARTCARD_MAX;

  const { data: technicianPartsRes, isLoading: isPartsLoading } =
    getTechnicianAddedParts(currentOrderId ?? undefined);

  const { mutateAsync: updateOrderPart, isPending: orderUpdating } =
    useUpdateOrderParts();
  const { mutateAsync: updatePartCondition } = useUpdatePartCondition();
  const { data: allParts } = useGetAllParts({});

  useEffect(() => {
    if (technicianPartsRes) {
      const mappedCart =
        technicianPartsRes.map((p: any) => ({
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

  const filteredParts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allParts?.data?.items.filter(
      (p) =>
        (query === "" || p.name.toLowerCase().includes(query)) &&
        (selectedCategory ? p.categoryId === Number(selectedCategory) : true)
    );
  }, [allParts, searchQuery, selectedCategory]);

  const displayParts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredParts?.slice(start, start + pageSize);
  }, [filteredParts, page, pageSize]);

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

  const handleCartQuantityChange = (partId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.part.id === partId ? { ...item, quantity } : item
      )
    );
  };

  const handleSendCart = async (
    damageLevels: Record<number, DamageLevelEnum>
  ) => {
    if (!currentOrderId || orderUpdating) return;
    try {
      await updateOrderPart({
        orderId: currentOrderId,
        parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
      });

      await updatePartCondition({
        appointmentId: currentOrderId,
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

      await queryClient.invalidateQueries({
        queryKey: ["TechnicianAddedParts", currentOrderId],
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
    }
  };

  const handleBack = () => navigate(-1);
  const handleOpenProductModal = (part: OrderPartsResponseDto) => {
    if (part.isDeleted || part.quantity <= 0) return;
    setSelectedPart(part);
    setOpen(true);
  };
  const handleCloseProductModal = () => setOpen(false);
  const handleOpenCart = () => setCartOpen(true);
  const handleCloseCart = () => setCartOpen(false);
  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return {
    cart,
    displayParts,
    page,
    searchQuery,
    isLoading: isPartsLoading,
    isSending: orderUpdating,
    pageSize,
    open,
    selectedPart,
    cartOpen,
    handleAddToCart,
    handleRemoveFromCart,
    handleCartQuantityChange,
    handleSendCart,
    handleBack,
    handleOpenProductModal,
    handleCloseProductModal,
    handleOpenCart,
    handleCloseCart,
    handlePageChange,
    handleSearchChange,
  };
};
