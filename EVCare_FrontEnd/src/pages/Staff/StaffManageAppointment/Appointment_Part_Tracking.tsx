import { useEffect, useState } from "react";
import { InputNumber } from "antd";
import { Package, CheckCircle, Edit3, X, Users, SquareX } from "lucide-react";
import type { AppointmentDetailModel } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import {
  useGetOrderDetail,
  useStaffUpdateOrder,
  useUpdateOrderStatus,
} from "../../../services/orderServiceApi";
import type { PartsDetailDto } from "../../../models/OrderModel/ViewOrderModel";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { formatCurrency } from "./../../../utils/formatCurrency";
import { useAppDispatch } from "../../../states/store";
import type {
  OrderPartDto,
  UpdateOrderRequest,
} from "../../../models/OrderModel/UpdateOrderModel";
import { useQueryClient } from "@tanstack/react-query";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import ConfirmModal from "../../../components/StatusModal/ConfirmModal";
import {
  useChangeAppointmentStatus,
  useGetAllAppointments,
} from "../../../services/appointmentServiceApi";
import { useNotification } from "../../../context/useNotification";
import {
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import { closeModel3d, openModel3d } from "../../../states/uiSlice";
import ShowButton from "../../../components/Button/ShowButton";
import { useLocation } from "react-router";
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";

interface Props {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  closeModal: () => void;
}

export default function Appointment_Part_Tracking({ data, closeModal }: Props) {
  const dispatch = useAppDispatch();
  const [parts, setParts] = useState<PartsDetailDto[]>([]);
  const [editingPartId, setEditingPartId] = useState<{
    partId: number;
    techId: number;
  } | null>(null);
  const [tempValue, setTempValue] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [stockMessage, setStockMessage] = useState("");
  const notification = useNotification();

  const location = useLocation();
  useEffect(() => {
    dispatch(closeModel3d());
  }, [location.pathname, dispatch]);

  //gọi hàm để lấy order detail
  const { data: order, isSuccess } = useGetOrderDetail(data.orderId);
  const { data: appointments, isLoading } = useGetAllAppointments({
    pageSize: 20,
    sortOrder: "desc",
    sortField: "Appointment_Date",
  });

  const appointment = appointments?.data?.items?.find(
    (appointment) => appointment.id === data.id
  );

  const workingTechnicians = appointment?.technicians || [];

  useEffect(() => {
    if (isSuccess && order?.data?.parts) {
      setParts(order.data.parts);
    }
  }, [isSuccess, order?.data?.parts]);

  const handleQuantityChange = async (
    partId: number | null,
    technicianId: number,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity > stock) {
      setStockMessage(`Exceeds stock by ${newQuantity - stock} items`);
      return;
    }
    if (newQuantity)
      if (newQuantity !== null) {
        const updatedParts = parts.map((part) =>
          part.technicianId === technicianId && part.id === partId
            ? { ...part, quantity: newQuantity }
            : part
        );
        setParts(updatedParts);
        setEditingPartId(null);
      } else {
        notification.error({
          message: "Change quantity error",
          showProgress: true,
        });
      }
  };

  const handleDeletePart = (
    edittingPart: {
      partId: number;
      techId: number;
    } | null
  ) => {
    setParts((prevParts) =>
      prevParts.filter(
        (part) =>
          !(
            part.id === editingPartId?.partId &&
            part.technicianId === edittingPart?.techId
          )
      )
    );
  };

  const { mutateAsync: updateOrderStatus, isPending: statusPending } =
    useUpdateOrderStatus();

  const { mutateAsync: updateOrder, isPending: orderPending } =
    useStaffUpdateOrder();

  const queryClient = useQueryClient();

  const handleConfirmOrder = async () => {
    try {
      const newOrderUpdate: UpdateOrderRequest<OrderPartDto> = {
        id: data.orderId,
        orderParts: parts.map((part) => ({
          partId: part.id,
          technicianId: part.technicianId,
          quantity: part.quantity,
        })),
      };
      await updateOrder(newOrderUpdate);

      await updateOrderStatus({ orderID: data.orderId, status: "Processing" });

      await queryClient.invalidateQueries({
        queryKey: ["OrderDetail", data.orderId],
      });

      setModalMessage("Order confirmed successfully");
      setIsSuccessModalOpen(true);
    } catch (error) {
      setModalMessage(String(error));
      setIsErrorModalOpen(true);
    }
  };

  const subtotal = parts.reduce(
    (sum, part) => sum + (part.price + part.replacementPrice) * part.quantity,
    0
  );

  const vatAmount = (subtotal * (order?.data?.vat ?? 0)) / 100;

  const calculateTotal = () => subtotal + vatAmount;

  const handleCloseModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["AppointmentDetail"] });
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const { mutateAsync: appointmentStatus } = useChangeAppointmentStatus();

  const handleCancelOrder = async () => {
    try {
      await appointmentStatus({ appointmentId: data.id, status: "Canceled" });

      await updateOrder({ id: data.orderId, orderParts: [] });
      await updateOrderStatus({ orderID: data.orderId, status: "Canceled" });
      queryClient.invalidateQueries({
        queryKey: ["OrderDetail", data.orderId],
      });
      closeModal();
      notification.success({
        message: MSG_TITLE.CANCEL_APPOINTMENT,
        description: SUCCESS_MESSAGE.APPOINTMENT_CANCELLED_SUCCESSFULLY,
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: MSG_TITLE.CANCEL_APPOINTMENT,
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  const handleCloseConfirm = () => {
    setConfirmCancel(false);
    setConfirmDelete(false);
  };

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderIcon>
            <Package size={36} color="#00ad4e" />
          </HeaderIcon>
          <HeaderText>
            <h1 style={{ color: "#00ad4e" }}>Order Tracking</h1>
            <OrderId>
              Order #{order?.data?.id} - Appointment ID: #{appointment?.id}
            </OrderId>
          </HeaderText>
        </Header>

        <Card>
          <SectionTitle>
            Order Parts ({parts.length})
            <div style={{ display: "flex", gap: "5px" }}>
              <ShowButton
                onclick={() => dispatch(openModel3d())}
                text="Model 3D"
                height="40px"
              />
            </div>
          </SectionTitle>

          {parts.map((part, i) => (
            <PartCard key={i}>
              <PartLeft>
                <PartImage src={part.imageUrl} alt={part.name} />
                <PartInfo>
                  <PartName>{part.name}</PartName>
                  <TechInfo>
                    Technician ID: {part.technicianId} — {part.technicianName}
                  </TechInfo>
                  <PriceRow>
                    <PriceItem>
                      <Label>Unit:</Label>
                      <TotalValue>{formatCurrency(part.price)}₫</TotalValue>
                    </PriceItem>
                    <PriceItem>
                      <Label>Replace:</Label>
                      <TotalValue>
                        {formatCurrency(part.replacementPrice)}₫
                      </TotalValue>
                    </PriceItem>
                  </PriceRow>
                </PartInfo>
              </PartLeft>

              <PartRight>
                <QuantitySection>
                  {editingPartId?.partId === part.id &&
                  editingPartId.techId === part.technicianId ? (
                    <QuantityEdit>
                      <InputNumber
                        min={1}
                        defaultValue={part.quantity}
                        onChange={(value) => setTempValue(value || 0)}
                        onPressEnter={() =>
                          handleQuantityChange(
                            part.id,
                            part.technicianId,
                            tempValue,
                            part.stock
                          )
                        }
                        autoFocus
                        style={{ fontFamily: "Outfit" }}
                      />
                      <IconButton
                        onClick={() => {
                          setEditingPartId(null);
                          setStockMessage("");
                        }}
                      >
                        <X size={16} />
                      </IconButton>
                    </QuantityEdit>
                  ) : (
                    <QuantityDisplay>
                      <QuantityLabel>Qty</QuantityLabel>
                      <QuantityValue>{part.quantity}</QuantityValue>
                      <IconButton
                        onClick={() => {
                          setEditingPartId({
                            partId: part.id,
                            techId: part.technicianId,
                          });
                          setStockMessage("");
                        }}
                      >
                        <Edit3 size={16} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setEditingPartId({
                            partId: part.id,
                            techId: part.technicianId,
                          });
                          setConfirmDelete(true);
                          setStockMessage("");
                        }}
                        className="danger"
                      >
                        <X size={16} />
                      </IconButton>
                    </QuantityDisplay>
                  )}
                  {editingPartId?.partId === part.id &&
                    editingPartId.techId === part.technicianId && (
                      <StockWarning>{stockMessage}</StockWarning>
                    )}
                </QuantitySection>

                <PartTotal>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>
                    {(
                      (part.price + part.replacementPrice) *
                      part.quantity
                    ).toLocaleString()}
                    ₫
                  </TotalValue>
                </PartTotal>
              </PartRight>
            </PartCard>
          ))}
        </Card>

        <Card>
          <SummaryTitle>Order Summary</SummaryTitle>

          <SummaryRow>
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </SummaryRow>
          <SummaryRow>
            <span>VAT ({order?.data?.vat}%)</span>
            <span>{vatAmount.toLocaleString()}₫</span>
          </SummaryRow>
          <Divider />
          <TotalRow>
            <span>Total Amount</span>
            <span>{calculateTotal().toLocaleString()}₫</span>
          </TotalRow>
          {orderPending || statusPending ? (
            <TextWaitingEffect text="Waiting for processing" fontSize="25px" />
          ) : (
            <ActionButton>
              <ConfirmButton onClick={() => setConfirmCancel(true)}>
                <SquareX size={20} />
                Cancel
              </ConfirmButton>
              <ConfirmButton onClick={handleConfirmOrder}>
                <CheckCircle size={20} />
                Confirm Order
              </ConfirmButton>
            </ActionButton>
          )}
        </Card>

        <Card>
          <TechnicianHeader>
            <Users size={22} />
            <SectionTitle>
              Working Technicians ({workingTechnicians.length})
            </SectionTitle>
          </TechnicianHeader>

          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ColorSpinner width="4em" height="4em" />
            </div>
          ) : workingTechnicians.length > 0 ? (
            <TechnicianList>
              {workingTechnicians.map((tech) => (
                <TechnicianItem key={tech.id}>
                  <TechAvatar
                    src={
                      tech.avatar ||
                      `https://ui-avatars.com/api/?name=${tech.fullName}&background=667eea&color=fff`
                    }
                    alt={tech.fullName}
                  />
                  <TechDetails>
                    <TechName>{tech.fullName}</TechName>
                    <TechId>ID: {tech.id}</TechId>
                    <TechId>Phone: {tech.phone}</TechId>
                  </TechDetails>
                  <StatusBadge $status={tech.status}>{tech.status}</StatusBadge>
                </TechnicianItem>
              ))}
            </TechnicianList>
          ) : (
            <EmptyState>
              <Users size={40} opacity={0.3} />
              <p>No technicians assigned</p>
            </EmptyState>
          )}
        </Card>
      </ContentWrapper>
      {isSuccessModalOpen && (
        <SuccessModal
          header="Order Confirm"
          message={modalMessage}
          action={handleCloseModal}
        />
      )}
      {isErrorModalOpen && (
        <FailedModal
          header="Order Confirm"
          message={modalMessage}
          action={handleCloseModal}
        />
      )}

      {confirmCancel && (
        <ConfirmModal
          open={confirmCancel}
          onClose={handleCloseConfirm}
          onConfirm={handleCancelOrder}
          message="Do you want to cancel this order?"
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          open={confirmDelete}
          onClose={handleCloseConfirm}
          onConfirm={() => handleDeletePart(editingPartId)}
          message="Do you want to delete this part?"
        />
      )}
    </PageContainer>
  );
}

import {
  ActionButton,
  Card,
  ConfirmButton,
  ContentWrapper,
  Divider,
  EmptyState,
  Header,
  HeaderIcon,
  HeaderText,
  IconButton,
  Label,
  OrderId,
  PageContainer,
  PartCard,
  PartImage,
  PartInfo,
  PartLeft,
  PartName,
  PartRight,
  PartTotal,
  PriceItem,
  PriceRow,
  QuantityDisplay,
  QuantityEdit,
  QuantityLabel,
  QuantitySection,
  QuantityValue,
  SectionTitle,
  StatusBadge,
  StockWarning,
  SummaryRow,
  SummaryTitle,
  TechAvatar,
  TechDetails,
  TechId,
  TechInfo,
  TechName,
  TechnicianHeader,
  TechnicianItem,
  TechnicianList,
  TotalLabel,
  TotalRow,
  TotalValue,
} from "./styles/Appointment_Part_Tracking.styled";
import ColorSpinner from "../StaffComponents/ColorSpinner";
