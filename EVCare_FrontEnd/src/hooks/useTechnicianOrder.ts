// src/hooks/useTechnicianOrder.ts
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../context/useNotification";
import { useQueryClient } from "@tanstack/react-query";

import { useUpdateOrderParts } from "../services/updateOrderPartApi";
import { useUpdatePartCondition } from "../services/appointmentPartCondition";

import type { OrderPartsResponseDto } from "../models/OrderPartModel/Order_Parts_Model";
import type { DamageLevelEnum } from "../models/enums/DamageLevelEnum";
import { useGetPartsInServices, useGetServicesInAppointment } from "../services/appointmentTechnicianApi";

interface UseTechnicianOrderProps {
  propOrderId?: number;
  onPartsUpdated?: (orderId: number) => void;
  selectedCategory: number;
  appointmentId: number;
}

export const useTechnicianOrder = ({
  propOrderId,
  onPartsUpdated,
  selectedCategory,
  appointmentId,
}: UseTechnicianOrderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();
  const queryClient = useQueryClient();

  const stateOrderId = (location.state as { orderId?: number })?.orderId;
  const [currentOrderId] = useState<number | null>(propOrderId ?? stateOrderId ?? null);

  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<OrderPartsResponseDto | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<{ part: OrderPartsResponseDto; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 8;
  const [pageIndex, setPageIndex] = useState(1);

  const { mutateAsync: updateOrderPart, isPending: orderUpdating } = useUpdateOrderParts();
  const { mutateAsync: updatePartCondition } = useUpdatePartCondition();

  const handleAddToCart = (part: OrderPartsResponseDto, quantity: number) => {
    setCart((prev) => {
      const exist = prev.find((item) => item.part.id === part.id);
      if (exist) {
        return prev.map((item) => (item.part.id === part.id ? { ...item, quantity: item.quantity + quantity } : item));
      }
      return [...prev, { part, quantity }];
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (partId: number) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
  };

  const handleCartQuantityChange = (partId: number, quantity: number) => {
    setCart((prev) => prev.map((item) => (item.part.id === partId ? { ...item, quantity } : item)));
  };

  const handleSendCart = async (damageLevels: Record<number, DamageLevelEnum>) => {
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
  const handlePageChange = (newPage: number) => setPageIndex(newPage);
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPageIndex(1);
  };

  const { data: serviceLists, isLoading: loadingServices } = useGetServicesInAppointment({ appointmentId });

  const { data: partsInService, isLoading: loadingPartInService } = useGetPartsInServices({
    ...((selectedCategory !== 0 && { serviceIds: [selectedCategory] }) || {}),
    ...((selectedCategory === 0 && { appointmentId: appointmentId }) || {}),
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  return {
    cart,
    pageIndex,
    pageSize,
    searchQuery,
    isSending: orderUpdating,
    open,
    selectedPart,
    cartOpen,
    totalPages: partsInService?.data?.totalPages,
    totalItems: partsInService?.data?.totalItems,
    serviceLists,
    loadingServices,
    partsInService,
    loadingPartInService,
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
