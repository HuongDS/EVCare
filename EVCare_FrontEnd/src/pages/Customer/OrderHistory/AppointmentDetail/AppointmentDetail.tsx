import CloseButton from "react-bootstrap/CloseButton";
import {
  Backdrop,
  DetailWrapper,
  ModalContent,
  NoteBox,
  OrderModal,
  Row,
  Section,
  ServiceItem,
  ServiceList,
  Status,
  StatusBadge,
  Title,
  TitleID,
  Wrapper,
  WaitingMessage,
  PartList,
  PartItem,
  PartImage,
  PartName,
  OrderSummary,
  SummaryLine,
  PartInfo,
  PartQuantity,
  PartPrices,
  PartPriceLine,
  TechnicianTable,
  TableRow,
  TableHeader,
  TableCell,
  Avatar,
  ProgressContainer,
  ProgressLabel,
  ProgressBarBg,
  ProgressBarFill,
  LogToggleBtn,
  LogsWrapper,
  PartLogGroup,
  PartLogHeader,
  TimelineItem,
  LogMessage,
} from "./AppointmentDetail.styled";
import NameBoxComponent from "../NameBox";
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import dayjs from "dayjs";
import type { PartsDetailDto } from "../../../../models/OrderModel/ViewOrderModel";
import { useGetOrderDetail } from "../../../../services/orderServiceApi";
import { useGetTechniciansByOrderId } from "../../../../services/technicianService";
import { useEffect, useState } from "react";
import { AppointmentStatusEnum } from "../../../../models/enums";
import type { OrderDetailLogs } from "../../../../models/OrderModel/OrderDetailLogs";
import { useNotification } from "../../../../context/useNotification";
import { getOrderDetailLogs } from "../../../../services/orderDetailLogsService";
import { FaChevronDown, FaChevronUp, FaTools } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import SpinnerComponent from "../../../../components/SpinnerComponent";

interface Props {
  onClose: () => void;
  open: boolean;
  appointmentId: number;
  data: AppointmentViewDetailModel;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function AppointmentDetail({ onClose, open, appointmentId, data }: Props) {
  const { data: order } = useGetOrderDetail(data.orderId);
  const { data: technicians } = useGetTechniciansByOrderId(data.orderId);
  const [processedData, setProcessedData] = useState<PartsDetailDto[]>([]);
  const progressPercent = order?.data?.percentInprogress ?? 0;
  const [showLogs, setShowLogs] = useState(false);
  const [logData, setLogData] = useState<OrderDetailLogs | undefined>(undefined);
  const notification = useNotification();
  const [isLoadingLogData, setIsLoadingLogData] = useState(false);

  if (!open) return;

  useEffect(() => {
    setProcessedData(order?.data?.parts ?? []);
  }, [order]);

  useEffect(() => {
    if (!showLogs) return;
    const fetchDataLogs = async () => {
      setIsLoadingLogData(true);
      try {
        const response = await getOrderDetailLogs({ orderId: data.orderId });
        setLogData(response.data);
      } catch (error) {
        notification.error({
          message: (error as Error).message,
        });
      }
      setIsLoadingLogData(false);
    };
    fetchDataLogs();
  }, [showLogs]);

  const subtotal =
    order?.data?.parts.reduce(
      (acc: number, part: PartsDetailDto) => acc + (part.price + part.replacementPrice) * part.quantity,
      0
    ) ?? 0;

  const getProgressDisplay = (percent: number, isCancel?: boolean) => {
    if (isCancel) {
      return {
        text: "This appointment has been canceled.",
        color: "#6b7280",
      };
    }
    if (percent === 0) {
      return {
        text: "Technician is working...",
        color: "#6b7280",
      };
    }
    if (percent === 100) {
      return {
        text: "Done",
        color: "#00ad4e",
      };
    }
    return {
      text: `${percent}%`,
      color: "#00ad4e",
    };
  };

  const progressInfo = getProgressDisplay(progressPercent, data.status === AppointmentStatusEnum.CANCELED);

  return (
    <DetailWrapper>
      <Wrapper $isOpen={open}>
        <Backdrop $isOpen={open} onClick={onClose} />
        <OrderModal $isOpen={open} onClick={(e) => e.stopPropagation()}>
          <Row
            style={{
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <CloseButton onClick={onClose} style={{ position: "absolute", top: 28, right: 10 }} />
            <TitleID>ID: #{appointmentId}</TitleID>
            <Status>
              Status: <StatusBadge status={data?.status || ""}>{data?.status}</StatusBadge>
            </Status>
          </Row>

          {order?.data && (
            <ProgressContainer>
              <ProgressLabel $color={progressInfo.color}>
                <span>Progress</span>
                <span>{progressInfo.text}</span>
              </ProgressLabel>

              {progressPercent !== 100 && data.status !== AppointmentStatusEnum.CANCELED && (
                <ProgressBarBg>
                  <ProgressBarFill style={{ width: `${progressPercent}%` }} />
                </ProgressBarBg>
              )}

              <LogToggleBtn onClick={() => setShowLogs(!showLogs)}>
                {showLogs ? "Hide Activity Logs" : "View Activity Logs"}
                {showLogs ? <FaChevronUp /> : <FaChevronDown />}
              </LogToggleBtn>

              {isLoadingLogData && <SpinnerComponent />}
            </ProgressContainer>
          )}

          <ModalContent>
            {logData && logData.parts.length > 0 && !isLoadingLogData && (
              <>
                <AnimatePresence>
                  {showLogs && (
                    <LogsWrapper
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {logData.parts.map((partLog) => (
                        <PartLogGroup key={partLog.partId}>
                          <PartLogHeader>
                            <FaTools size={14} />
                            <span>{partLog.partName}</span>
                          </PartLogHeader>

                          {partLog.message.map((msg, idx) => (
                            <TimelineItem key={idx}>
                              <LogMessage>{msg}</LogMessage>
                            </TimelineItem>
                          ))}
                        </PartLogGroup>
                      ))}
                    </LogsWrapper>
                  )}
                </AnimatePresence>
              </>
            )}

            <Section>
              <Title>Information</Title>
              <Row>
                <NameBoxComponent label="Customer's Name" name={data.customerName} />
                <NameBoxComponent label="Vehicle Model" name={data.vehicleName} />
              </Row>
              <Row>
                <NameBoxComponent label="Phone" name={data.phoneNumber ?? "default"} />
                <NameBoxComponent label="Date" name={dayjs(data.appointmentDate).format("DD/MM/YYYY")} />
              </Row>
              <Row>
                <NameBoxComponent label="Service Staff" name={data.employeeName} />
              </Row>
              <Row>
                <NoteBox readOnly value={data.note} placeholder="Note" />
              </Row>
            </Section>

            <Section>
              <Title>Services</Title>
              <ServiceList>
                {data?.services.map((s) => (
                  <Row key={s.id}>
                    <ServiceItem> {s.name}</ServiceItem>
                  </Row>
                ))}
              </ServiceList>
            </Section>

            <Section>
              <Title>Order Details</Title>
              {!processedData || processedData.length == 0 ? (
                <WaitingMessage>Please wait for the technician to inspect your vehicle.</WaitingMessage>
              ) : (
                <>
                  <PartList>
                    {processedData.map((part) => (
                      <PartItem key={part.id}>
                        <PartInfo>
                          <PartImage src={part.imageUrl} alt={part.name} />
                          <PartName title={part.name}>{part.name}</PartName>
                        </PartInfo>

                        <PartQuantity>x{part.quantity}</PartQuantity>

                        <PartPrices>
                          <PartPriceLine>
                            <span>Unit:</span> {formatCurrency(part.price)}
                          </PartPriceLine>
                          <PartPriceLine>
                            <span>Replacement Price:</span> {formatCurrency(part.replacementPrice)}
                          </PartPriceLine>
                        </PartPrices>
                      </PartItem>
                    ))}
                  </PartList>

                  <OrderSummary>
                    <SummaryLine>
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </SummaryLine>
                    <SummaryLine>
                      <span>VAT ({order?.data?.vat ?? 0}%)</span>
                      <span>{formatCurrency((subtotal * (order?.data?.vat ?? 0)) / 100)}</span>
                    </SummaryLine>
                    <SummaryLine>
                      <strong>Total Price</strong>
                      <strong>{formatCurrency(order?.data?.price ?? 0)}</strong>
                    </SummaryLine>
                  </OrderSummary>
                </>
              )}
            </Section>

            {order && order.data?.parts.length != 0 && technicians && (technicians.data?.length ?? 0) > 0 && (
              <Section>
                <Title>Technicians</Title>
                <TechnicianTable>
                  <thead>
                    <TableRow>
                      <TableHeader>Avatar</TableHeader>
                      <TableHeader>Name</TableHeader>
                      <TableHeader>Experience</TableHeader>
                    </TableRow>
                  </thead>
                  <tbody>
                    {technicians.data?.map((tech) => (
                      <TableRow key={tech.id}>
                        <TableCell>
                          <Avatar src={tech.avatar || "/default-avatar.png"} alt={tech.fullName} />
                        </TableCell>
                        <TableCell>{tech.fullName}</TableCell>
                        <TableCell>{tech.expYears ?? 0} years</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </TechnicianTable>
              </Section>
            )}
          </ModalContent>
        </OrderModal>
      </Wrapper>
    </DetailWrapper>
  );
}
