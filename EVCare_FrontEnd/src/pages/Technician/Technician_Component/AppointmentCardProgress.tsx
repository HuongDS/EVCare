// src/pages/Technician/Technician_Component/AppointmentCardProgress.tsx

import React from "react";
import { formatDate } from "../../../utils/formatDate";
import {
  DamageLevelEnum,
  DamageLevelLabels,
} from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";
import {
  CardContainer,
  Header,
  ImageCarousel,
  ImageItem,
  InfoBox,
  InfoColumn,
  ListSection,
  SectionContainer,
  SectionTitle,
  ListWrapper,
  PartItem,
  DamageLevelBadgeStyled,
  ButtonWrapper,
  SubTitle,
} from "./Style/AppointmentCardProgress.styled";

import { useAppointmentCardProgress } from "../../../hooks/useAppointmentCardProgress"; // <-- Import Hook mới

import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";

type Props = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
  onPartsUpdated?: (orderId: number) => void;
};

const AppointmentCardProgress: React.FC<Props> = ({
  data,
  onStatusChange,
  onPartsUpdated,
}) => {
  // --- GỌI HOOK ---
  const { currentStatus, damageLevels, parts, isLoadingParts, handleAction } =
    useAppointmentCardProgress({ data, onStatusChange, onPartsUpdated });

  return (
    <CardContainer>
      <Header>
        <div>Appointment #{data.id}</div>
        {/* Dùng currentStatus từ hook */}
        <div>{currentStatus.replace("_", " ")}</div>
      </Header>
      
      {/* ... Phần UI (giữ nguyên) ... */}

      {data.appointmentImages?.length > 0 && (
        <ImageCarousel>
          {data.appointmentImages.map((img, idx) => (
            <ImageItem key={idx}>
              <img src={img} alt={`appointment-${idx}`} />
            </ImageItem>
          ))}
        </ImageCarousel>
      )}
      
      <InfoBox>
        {/* ... Info (giữ nguyên) ... */}
        <InfoColumn>
          <div>
            <strong>Customer:</strong> {data.customerName}
          </div>
          <div>
            <strong>Vehicle:</strong> {data.vehicleModel}
          </div>
          <div>
            <strong>License:</strong> {data.licensePlate}
          </div>
        </InfoColumn>
        <InfoColumn>
          <div>
            <strong>Phone:</strong> {data.phoneNumber ?? "default"}
          </div>
          <div>
            <strong>Date:</strong> {formatDate(data.appointmentDate)}
          </div>
        </InfoColumn>
      </InfoBox>
      
      <ListSection>
        <SectionContainer>
          <SectionTitle>Services</SectionTitle>
          <ListWrapper>
            {data.services?.length ? (
              <ul>
                {data.services.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="empty">No services</div>
            )}
          </ListWrapper>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>
            Parts{" "}
            <SubTitle
              style={{
                fontSize: "0.7rem",
                fontWeight: "400",
                color: "#777",
              }}
            >
              Only the parts you have added
            </SubTitle>
          </SectionTitle>
          <ListWrapper>
            {/* Dùng isLoadingParts và parts từ hook */}
            {isLoadingParts ? (
              <div className="empty">Loading parts...</div>
            ) : parts.length > 0 ? (
              <ul>
                {parts.map((p) => (
                  <PartItem key={p.partID}>
                    <span>
                      {p.partName} × {p.quantity} — {p.price.toLocaleString()}₫
                    </span>
                    <DamageLevelBadgeStyled
                      $level={
                        damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed
                      }
                    >
                      {
                        DamageLevelLabels[
                          damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed
                        ]
                      }
                    </DamageLevelBadgeStyled>
                  </PartItem>
                ))}
              </ul>
            ) : (
              <div className="empty">No parts</div>
            )}
          </ListWrapper>
        </SectionContainer>
      </ListSection>
      
      <ButtonWrapper>
        {/* Dùng handleAction từ hook */}
        <ReviewButton
          status={currentStatus}
          onAction={handleAction}
          appointment={data}
          orderId={data.orderId}
        />
      </ButtonWrapper>
    </CardContainer>
  );
};

export default AppointmentCardProgress;