import React, { useMemo } from "react";
import { Modal, Spin } from "antd";
import { useQueries } from "@tanstack/react-query";
import { useGetOrderDetail } from "../../../services/orderServiceApi";
import { getTechnicianDetail } from "../../../services/technicianDetail";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";

import {
  ModalContainer,
  Header,
  MainGrid,
  InfoSection,
  InfoItem,
  ListSection,
  ListBox,
  SectionTitle,
  ListWrapper,
} from "./Style/ViewDetailsModal.styled";
import { formatDate } from "../../../utils/formatDate";

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

  // Lấy danh sách unique technicianIds
  const technicianIds = useMemo(() => {
    if (!parts) return [];
    return Array.from(
      new Set(
        parts.map((p: any) => Number(p.technicianId)).filter((id) => !isNaN(id))
      )
    );
  }, [parts]);

  // Lấy thông tin từng technician bằng useQueries
  const techQueries = useQueries({
    queries: technicianIds.map((id) => ({
      queryKey: ["technicianDetail", id],
      queryFn: () => getTechnicianDetail(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Tạo map technicianId -> fullName
  const techMap = useMemo(() => {
    const map: Record<number, string> = {};
    techQueries.forEach((q, index) => {
      if (q.data) {
        map[technicianIds[index]] = q.data.fullName;
      }
    });
    return map;
  }, [techQueries, technicianIds]);

  const isTechLoading = techQueries.some((q) => q.isLoading);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      closable
    >
      <ModalContainer>
        <Header>
          <h2>Details</h2>
        </Header>

        {appointment && (
          <MainGrid>
            <InfoSection>
              <div>
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
              </div>
              <div>
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
              </div>
            </InfoSection>

            {/* --- Danh sách service & part --- */}
            <ListSection>
              <ListBox>
                <SectionTitle>Services</SectionTitle>
                <ListWrapper>
                  {appointment.services?.length ? (
                    <ul>
                      {appointment.services.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty">No services</div>
                  )}
                </ListWrapper>
              </ListBox>

              <ListBox>
                <SectionTitle>Part list</SectionTitle>
                <ListWrapper>
                  {isLoading || isTechLoading ? (
                    <Spin />
                  ) : parts?.length ? (
                    <ul>
                      {parts.map((p: any, idx: number) => (
                        <li
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "4px 0",
                          }}
                        >
                          <span>
                            {p.name} × {p.quantity}
                          </span>
                          <span
                            style={{
                              fontStyle: "italic",
                              color: "#555",
                              fontSize: "0.9rem",
                            }}
                          >
                            {techMap[p.technicianId] ?? "—"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty">No parts</div>
                  )}
                </ListWrapper>
              </ListBox>
            </ListSection>
          </MainGrid>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default ViewDetailsModal;
