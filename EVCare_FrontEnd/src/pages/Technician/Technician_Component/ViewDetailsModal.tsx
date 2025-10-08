import React from "react";
import { Modal } from "antd";
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
                  {appointment.phoneNumber}
                </InfoItem>
                <InfoItem>
                  <span className="label">Date:</span>{" "}
                  {formatDate(appointment.appointmentDate)}
                </InfoItem>
              </div>
            </InfoSection>

            {/* HÀNG DƯỚI: LIST */}
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
                  {appointment.parts?.length ? (
                    <ul>
                      {appointment.parts.map((p, idx) => (
                        <li key={idx}>
                          {p.name} × {p.quantity}
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
