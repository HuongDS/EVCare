import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/useNotification";
import { useQueryClient } from "@tanstack/react-query";

import {
  useAddPartToOrder,
  useUpdateOrderParts,
} from "../services/updateOrderPartApi";
import { useUpdatePartCondition } from "../services/appointmentPartCondition";

import type {
  OrderPartsResponseDto,
  ResponseDto,
} from "../models/OrderPartModel/Order_Parts_Model";
import { DamageLevelStringEnum } from "../models/enums/DamageLevelEnum";
import {
  useGetPartsInServices,
  useGetServicesInAppointment,
} from "../services/appointmentTechnicianApi";
import type {
  AppointmentPartCondition,
  PartDamageLevelDetail,
} from "../models/OrderPartModel/AppointmentPartCondition";

interface UseTechnicianOrderProps {
  orderId: number;
  selectedCategory: number;
  appointmentId: number;
  setCurrentCategory: (v: number) => void;
  setIsOrder: (v: boolean) => void;
}

export const useTechnicianOrder = ({
  orderId,
  selectedCategory,
  appointmentId,
  setCurrentCategory,
  setIsOrder,
}: UseTechnicianOrderProps) => {
  const navigate = useNavigate();
  const notification = useNotification();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = 8;
  const [pageIndex, setPageIndex] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedPart, setSelectedPart] =
    useState<OrderPartsResponseDto | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<
    { part: OrderPartsResponseDto; quantity: number }[]
  >([]);
  const [damageLevels, setDamageLevels] = useState<
    Record<number, DamageLevelStringEnum>
  >({});
  const [isInitialized, setIsInitialized] = useState(false);

  const { mutateAsync: createOrderParts, isPending: creating } =
    useAddPartToOrder();
  const { mutateAsync: updatePartCondition } = useUpdatePartCondition();
  const { mutateAsync: updateOrderPart, isPending: updating } =
    useUpdateOrderParts();
  const appointment = queryClient.getQueryData<
    ResponseDto<AppointmentPartCondition<PartDamageLevelDetail>>
  >(["AppointmentHasCondition", appointmentId]);

  useEffect(() => {
    if (
      appointment?.data &&
      !isInitialized &&
      appointment.data.partDamageLevels
    ) {
      const initialCart = appointment.data.partDamageLevels.map((part) => ({
        part: {
          id: part.partId,
          name: part.partName,
          quantity: part.quantity,
          price: part.price,
          imageUrl: part.partUrl,
        } as OrderPartsResponseDto,
        quantity: part.quantity ?? 1,
      }));
      setCart(initialCart);

      const initLevels: Record<number, DamageLevelStringEnum> = {};
      appointment.data.partDamageLevels.map((part) => {
        initLevels[part.partId] =
          part.damageLevel ?? DamageLevelStringEnum.NotAssessed;
      });
      setDamageLevels(initLevels);

      setIsInitialized(true);
    }
  }, [isInitialized]);

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

    setDamageLevels((prev) => {
      if (!prev[part.id]) {
        return { ...prev, [part.id]: DamageLevelStringEnum.NotAssessed };
      }
      return prev;
    });
    setCartOpen(true);
  };

  const handleRemoveFromCart = (partId: number) => {
    setCart((prev) => prev.filter((item) => item.part.id !== partId));
    setDamageLevels((prev) => {
      const newLevels = { ...prev };
      delete newLevels[partId];
      return newLevels;
    });
  };

  const handleCartQuantityChange = (partId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.part.id === partId ? { ...item, quantity } : item
      )
    );
  };

  const handleSendCart = async (orderId: number) => {
    console.log(cart);

    try {
      await createOrderParts({
        orderId: orderId,
        parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
      });

      await updatePartCondition({
        appointmentId: appointmentId,
        partDamageLevels: Object.entries(damageLevels).map(([id, level]) => ({
          partId: Number(id),
          levelEnum: level,
        })),
      });

      notification.success({
        message: "Add Parts Successful",
        description: "Parts and damage levels are added successfully!",
        showProgress: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ["AppointmentHasCondition", orderId],
      });
      setCartOpen(false);
      setIsOrder(false);
    } catch (err) {
      notification.error({
        message: "Add Parts Failed",
        description:
          (err as Error).message || "Failed to add parts or damage levels",
        showProgress: true,
      });
    }
  };

  const handleUpdateCart = async (orderId: number) => {
    console.log(cart);

    try {
      await updateOrderPart({
        orderId: orderId,
        parts: cart.map((c) => ({ id: c.part.id, quantity: c.quantity })),
      });
      await updatePartCondition({
        appointmentId: appointmentId,
        partDamageLevels: Object.entries(damageLevels).map(([id, level]) => ({
          partId: Number(id),
          levelEnum: level,
        })),
      });
      notification.success({
        message: "Update Successful",
        description: "Parts and damage levels are updated successfully!",
        showProgress: true,
      });
      await queryClient.invalidateQueries({
        queryKey: ["AppointmentHasCondition", orderId],
      });
      setCartOpen(false);
    } catch (err) {
      notification.error({
        message: "Update Failed",
        description:
          (err as Error).message || "Failed to update parts or damage levels",
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

  const { data: serviceLists, isLoading: loadingServices } =
    useGetServicesInAppointment({ appointmentId });

  const {
    data: partsInService,
    isLoading: loadingPartInService,
    refetch,
  } = useGetPartsInServices({
    ...((searchQuery !== "" && { keyWord: searchQuery }) || {}),
    ...((selectedCategory !== 0 && { serviceIds: [selectedCategory] }) || {}),
    ...((selectedCategory === 0 && { appointmentId: appointmentId }) || {}),
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  const handleSelectAllParts = async () => {
    setCurrentCategory(0);
    refetch();
  };

  return {
    cart,
    orderId,
    pageIndex,
    pageSize,
    searchQuery,
    isSending: creating,
    isUpdating: updating,
    appointmentHasCondition: appointment,
    open,
    selectedPart,
    cartOpen,
    totalPages: partsInService?.data?.totalPages,
    totalItems: partsInService?.data?.totalItems,
    serviceLists,
    loadingServices,
    partsInService,
    loadingPartInService,
    damageLevels,
    setDamageLevels,
    handleAddToCart,
    handleUpdateCart,
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
    handleSelectAllParts,
  };
};
