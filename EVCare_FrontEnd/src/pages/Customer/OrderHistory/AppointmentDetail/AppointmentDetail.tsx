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
  // TechnicianTable,
  // TableHeader,
  // TableRow,
  // TableCell,
  // Avatar,
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
} from "./AppointmentDetail.styled";
import NameBoxComponent from "../NameBox";
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import dayjs from "dayjs";
import type { PartsDetailDto } from "../../../../models/OrderModel/ViewOrderModel";
import { useGetOrderDetail } from "../../../../services/orderServiceApi";

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
  // const [technicians, setTechnicians] = useState<EmployeeViewModel[]>([]);

  if (!open) return;

  const subtotal =
    order?.data?.parts.reduce(
      (acc: number, part: PartsDetailDto) => acc + (part.price + part.replacementPrice) * part.quantity,
      0
    ) ?? 0;

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

          <ModalContent>
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

            {/* 5. SECTION TECHNICIAN (Đọc từ 'technicians' state) */}

            <Section>
              <Title>Service</Title>
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
              {!order ? (
                <WaitingMessage>Please wait for the technician to inspect your vehicle.</WaitingMessage>
              ) : (
                <>
                  <PartList>
                    {order.data?.parts.map((part) => (
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
                            <span>Install:</span> {formatCurrency(part.replacementPrice)}
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
                      <span>VAT ({order.data?.vat ?? 0}%)</span>
                      <span>{formatCurrency((subtotal * (order.data?.vat ?? 0)) / 100)}</span>
                    </SummaryLine>
                    <SummaryLine>
                      <strong>Total Price</strong>
                      <strong>{formatCurrency(order.data?.price ?? 0)}</strong>
                    </SummaryLine>
                  </OrderSummary>
                </>
              )}
            </Section>
          </ModalContent>
        </OrderModal>
      </Wrapper>
    </DetailWrapper>
  );
}
