import React, { useMemo } from "react";
import { Modal, Spin, Table, Typography } from "antd";
import { useQueries } from "@tanstack/react-query";
import { useGetOrderDetail } from "../../../services/orderServiceApi";
import { getTechnicianDetail } from "../../../services/technicianDetail";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { formatDate } from "../../../utils/formatDate";
import {
  ModalContainer,
  Header,
  InfoSection,
  InfoColumn,
  InfoItem,
  SectionTitle,
  ServiceTagContainer,
  PartsTableWrapper,
  EmptyText,
  TagStyled,
} from "./Style/ViewDetailsModal.styled";

const { Text } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  appointment: TechnicianAppointmentsDto | null;
}

const ViewDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const orderId = appointment?.orderId ?? 0;
  const { data: orderDetail, isLoading } = useGetOrderDetail(orderId);
  const parts = orderDetail?.data?.parts ?? [];

  const technicianIds = useMemo(() => {
    if (!parts) return [];
    return Array.from(
      new Set(
        parts.map((p: any) => Number(p.technicianId)).filter((id) => !isNaN(id))
      )
    );
  }, [parts]);

  const techQueries = useQueries({
    queries: technicianIds.map((id) => ({
      queryKey: ["technicianDetail", id],
      queryFn: () => getTechnicianDetail(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const techMap = useMemo(() => {
    const map: Record<number, string> = {};
    techQueries.forEach((q, i) => {
      if (q.data) map[technicianIds[i]] = q.data.fullName;
    });
    return map;
  }, [techQueries, technicianIds]);

  const isTechLoading = techQueries.some((q) => q.isLoading);

  const columns = [
    {
      title: "Part Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
    },
    {
      title: "Technician",
      dataIndex: "technicianId",
      key: "technicianId",
      render: (id: number) => techMap[id] || "—",
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={900}
      centered
      closable
    >
      <ModalContainer>
        <Header>
          <h2>Appointment Details</h2>
        </Header>

        {appointment && (
          <>
            <InfoSection>
              <InfoColumn>
                <SectionTitle>Customer Information</SectionTitle>
                <InfoItem>
                  <span className="label">Appointment ID:</span> #
                  {appointment.id}
                </InfoItem>
                <InfoItem>
                  <span className="label">Customer:</span>{" "}
                  {appointment.customerName}
                </InfoItem>
                <InfoItem>
                  <span className="label">Vehicle:</span>{" "}
                  {appointment.vehicleModel}
                </InfoItem>
                <InfoItem>
                  <span className="label">License Plate:</span>{" "}
                  {appointment.licensePlate}
                </InfoItem>
                <InfoItem>
                  <span className="label">Phone:</span>{" "}
                  {appointment.phoneNumber ?? "—"}
                </InfoItem>
                <InfoItem>
                  <span className="label">Date:</span>{" "}
                  {formatDate(appointment.appointmentDate)}
                </InfoItem>
              </InfoColumn>

              <InfoColumn>
                <SectionTitle>Services</SectionTitle>
                {appointment.services?.length ? (
                  <ServiceTagContainer>
                    {appointment.services.map((s, idx) => (
                      <TagStyled key={idx}>{s}</TagStyled>
                    ))}
                  </ServiceTagContainer>
                ) : (
                  <EmptyText>No services</EmptyText>
                )}
              </InfoColumn>
            </InfoSection>

            <PartsTableWrapper>
              <SectionTitle>Parts Used</SectionTitle>
              {isLoading || isTechLoading ? (
                <div className="spinner">
                  <Spin />
                </div>
              ) : parts?.length ? (
                <Table
                  columns={columns}
                  dataSource={parts.map((p, idx) => ({ ...p, key: idx }))}
                  pagination={false}
                  bordered
                  size="middle"
                />
              ) : (
                <EmptyText>No parts</EmptyText>
              )}
            </PartsTableWrapper>
          </>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default ViewDetailsModal;
