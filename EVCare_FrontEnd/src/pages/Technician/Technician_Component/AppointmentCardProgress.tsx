import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatDate } from "../../../utils/formatDate";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { getAppointmentPartCondition } from "../../../services/appointmentPartCondition";

import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import {
  DamageLevelEnum,
  DamageLevelLabels,
  damageColorMap,
} from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";

// --- Styled Components ---
const CardContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.15rem;
  font-weight: 600;
`;

const ImageCarousel = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0.5rem 0;
  border-radius: 8px;
  background: #f4f4f4;
`;

const ImageItem = styled.div`
  min-width: 150px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  gap: 2rem;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionContainer = styled.div`
  background: #fafafa;
  border-radius: 8px;
  padding: 1rem;
  flex: 1;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ListWrapper = styled.div`
  max-height: 220px;
  overflow-y: auto;
  padding-right: 0.5rem;
  ul {
    padding-left: 1rem;
    margin: 0;
  }
  .empty {
    color: #888;
    font-size: 0.95rem;
  }
`;

const ListSection = styled.div`
  display: flex;
  gap: 2rem;
`;

const PartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;

  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const DamageLevelBadgeStyled = styled.span<{ $level: DamageLevelEnum }>`
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $level }) => damageColorMap[$level] || "#999"};
`;

// **Container cho nút**
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
`;

// --- Component ---
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
  const [currentStatus, setCurrentStatus] =
    useState<TechnicianWorkingSessionEnum>(
      data.status as TechnicianWorkingSessionEnum
    );
  const [damageLevels, setDamageLevels] = useState<
    Record<number, DamageLevelEnum>
  >({});

  useEffect(() => {
    const fetchDamageLevels = async () => {
      try {
        const response = await getAppointmentPartCondition(data.id);
        const map: Record<number, DamageLevelEnum> = {};
        response.data?.partDamageLevels?.forEach((d) => {
          switch (d.damageLevel) {
            case "Minor":
              map[d.partId] = DamageLevelEnum.Minor;
              break;
            case "Moderate":
              map[d.partId] = DamageLevelEnum.Moderate;
              break;
            case "Severe":
              map[d.partId] = DamageLevelEnum.Severe;
              break;
            case "Critical":
              map[d.partId] = DamageLevelEnum.Critical;
              break;
            default:
              map[d.partId] = DamageLevelEnum.NotAssessed;
          }
        });
        setDamageLevels(map);
      } catch (err) {
        console.error("Failed to load part condition:", err);
      }
    };

    if (data.id) fetchDamageLevels();
  }, [data.id]);

  const handleAction = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    onStatusChange?.(data.orderId, nextStatus);

    try {
      await updateTechnicianWorkingSession({
        orderId: data.orderId,
        status: nextStatus,
      });
      onPartsUpdated?.(data.orderId);
    } catch (err) {
      console.error(err);
      setCurrentStatus(prevStatus);
      onStatusChange?.(data.orderId, prevStatus);
      alert(ERROR_MESSAGE.CAN_NOT_UPDATE_STATUS);
    }
  };

  return (
    <CardContainer>
      {/* Header */}
      <Header>
        <div>Appointment #{data.id}</div>
        <div>{currentStatus.replace("_", " ")}</div>
      </Header>

      {/* Image Carousel */}
      {data.appointmentImages?.length > 0 && (
        <ImageCarousel>
          {data.appointmentImages.map((img, idx) => (
            <ImageItem key={idx}>
              <img src={img} alt={`appointment-${idx}`} />
            </ImageItem>
          ))}
        </ImageCarousel>
      )}

      {/* Info Box */}
      <InfoBox>
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

      {/* Lists */}
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
          <SectionTitle>Parts</SectionTitle>
          <ListWrapper>
            {data.parts?.length ? (
              <ul>
                {data.parts.map((p, idx) => (
                  <PartItem key={idx}>
                    {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
                    <span>
                      {p.name} × {p.quantity} — {p.price.toLocaleString()}₫
                    </span>
                    <DamageLevelBadgeStyled
                      $level={damageLevels[p.id] ?? DamageLevelEnum.NotAssessed}
                    >
                      {
                        DamageLevelLabels[
                          damageLevels[p.id] ?? DamageLevelEnum.NotAssessed
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

      {/* Nút bên phải */}
      <ButtonWrapper>
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
