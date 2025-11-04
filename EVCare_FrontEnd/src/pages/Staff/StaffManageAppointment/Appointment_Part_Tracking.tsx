import { useEffect, useState } from "react";
import { InputNumber } from "antd";
import styled from "styled-components";
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
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useNotification } from "../../../context/useNotification";
import {
  MSG_TITLE,
  SUCCESS_MESSAGE,
} from "../../../constants/messages/Message";
import { closeModel3d, openModel3d } from "../../../states/uiSlice";
import ShowButton from "../../../components/Button/ShowButton";
import { useLocation } from "react-router";

interface Props {
  data: AppointmentDetailModel<TechnicianModel<TechnicianSkills>>;
  closeModal: () => void;
  onConfirmSuccess?: () => void;
}

export default function Appointment_Part_Tracking({
  data,
  closeModal,
  onConfirmSuccess,
}: Props) {
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
  const { data: appointments } = useGetAllAppointments({
    pageSize: 20,
    sortOrder: "desc",
    sortField: "Appointment_Date",
  });

  const appointment = appointments?.data?.items?.find(
    (appointment) => appointment.id === data.id
  );

  // Get working technicians from appointment data
  const workingTechnicians = appointment?.technicians || [];

  //nếu lấy thành công thì set mảng parts vào trong state
  useEffect(() => {
    if (isSuccess && order?.data?.parts) {
      setParts(order.data.parts);
    }
  }, [isSuccess, order?.data?.parts]);

  //hàm này thay đổi quantity được nhập từ staff
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

  //hàm này xóa 1 part trong order
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

  //Khi nhấn confirm thì gọi hàm này
  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus();

  const { mutateAsync: updateOrder, isPending } = useStaffUpdateOrder();
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

      onConfirmSuccess?.();
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

  //đóng success, fail modal
  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  // hủy cuộc hẹn
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
            <Package size={36} />
          </HeaderIcon>
          <HeaderText>
            <h1>Order Tracking</h1>
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

          {parts.map((part) => (
            <PartCard key={part.id}>
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
                      <Value>{formatCurrency(part.price)}₫</Value>
                    </PriceItem>
                    <PriceItem>
                      <Label>Replace:</Label>
                      <Value>{formatCurrency(part.replacementPrice)}₫</Value>
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
          <ActionButton>
            <ConfirmButton onClick={() => setConfirmCancel(true)}>
              <SquareX size={20} />
              Cancel
            </ConfirmButton>
            {isPending ? (
              <SpinnerComponent />
            ) : (
              <ConfirmButton onClick={handleConfirmOrder}>
                <CheckCircle size={20} />
                Confirm Order
              </ConfirmButton>
            )}
          </ActionButton>
        </Card>

        <Card>
          <TechnicianHeader>
            <Users size={22} />
            <SectionTitle>
              Working Technicians ({workingTechnicians.length})
            </SectionTitle>
          </TechnicianHeader>

          {workingTechnicians.length > 0 ? (
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

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

const ContentWrapper = styled.div`
  max-width: 896px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: white;
`;

const HeaderIcon = styled.div`
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const HeaderText = styled.div`
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const OrderId = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

const PartCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 18px 20px;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  margin-bottom: 14px;
  background: #ffffff;
  transition: all 0.25s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: #667eea;
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.15);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;

const PartLeft = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  align-items: center;

  @media (max-width: 768px) {
    align-items: flex-start;
  }
`;

const PartRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 180px;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: auto;
  }
`;

const StockWarning = styled.p`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 600;
`;

const PartImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const PartInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PartName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const TechInfo = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 16px;
`;

const PriceItem = styled.div`
  display: flex;
  gap: 4px;
  align-items: baseline;
`;

const Label = styled.span`
  font-size: 11px;
  color: #999;
  font-weight: 600;
`;

const Value = styled.span`
  font-size: 13px;
  color: #000000;
  font-weight: 600;
`;

const QuantitySection = styled.div`
  /* display: flex; */
  justify-content: center;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
`;

const QuantityDisplay = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const QuantityLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
`;

const QuantityValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
`;

const QuantityEdit = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .ant-input-number {
    width: 80px;
  }
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
  border: none;
  background: #00ad4e;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.1);
  }

  &.danger {
    background: #dc3545;
  }
`;

const PartTotal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;

  @media (max-width: 768px) {
    grid-column: 1 / -1;
    align-items: flex-start;
  }
`;

const TotalLabel = styled.div`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
`;

const TotalValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 15px;
  color: #666;

  span:last-child {
    font-weight: 600;
    color: #333;
  }
`;

const Divider = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent, #e0e0e0, transparent);
  margin: 12px 0;
`;

const TotalRow = styled(SummaryRow)`
  font-size: 20px;
  font-weight: 700;
  padding: 16px 0 20px 0;

  span:first-child {
    color: #333;
  }

  span:last-child {
    color: #667eea;
  }
`;

const ActionButton = styled.div`
  display: flex;
  gap: 10px;
  button:nth-child(1) {
    background: linear-gradient(135deg, #c12a2a 0%, #eec0bc 100%);
  }
`;

const ConfirmButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #75e76f 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TechnicianHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #667eea;
  margin-bottom: 20px;

  h2 {
    margin: 0;
  }
`;

const TechnicianList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TechnicianItem = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }
`;

const TechAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
`;

const TechDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TechName = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #333;
`;

const TechId = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  border: 1px solid;
  white-space: nowrap;

  ${(props) => {
    switch (props.$status) {
      case "Available":
        return `
          background: #e8f5e9;
          color: #2e7d32;
          border-color: #a5d6a7;
        `;
      case "Busy":
        return `
          background: #fff3e0;
          color: #e65100;
          border-color: #ffcc80;
        `;
      case "OnLeave":
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #616161;
          border-color: #e0e0e0;
        `;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;

  p {
    margin-top: 12px;
    font-size: 14px;
  }
`;
