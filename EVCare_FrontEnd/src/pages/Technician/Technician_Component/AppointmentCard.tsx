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
import { useNotification } from "../../../context/useNotification";
// --- Styled Components ---
const CardContainer = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.95rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.05rem;
`;

const ImageCarousel = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 0.5rem 0;
  border-radius: 6px;
  background: #f4f4f4;
`;

const ImageItem = styled.div`
  min-width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SectionBox = styled.div`
  background: #f9f9f9;
  border-radius: 8px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
`;

const InfoBox = styled(SectionBox)`
  flex-direction: row;
  justify-content: space-between;
`;

const InfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const ListWrapper = styled.div`
  max-height: 150px;
  overflow-y: auto;
  ul {
    padding-left: 1rem;
    margin: 0;
    font-size: 0.95rem;
  }
  .empty {
    color: #888;
    font-size: 0.9rem;
  }
`;

const PartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;

  img {
    width: 45px;
    height: 45px;
    object-fit: cover;
    border-radius: 6px;
  }
`;

const DamageLevelBadgeStyled = styled.span<{ $level: DamageLevelEnum }>`
  padding: 3px 6px;
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${({ $level }) => damageColorMap[$level] || "#999"};
`;

const ListSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8rem;
`;

type Props = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
  onPartsUpdated?: (orderId: number) => void;
};

const AppointmentCard: React.FC<Props> = ({
  data,
  onStatusChange,
  onPartsUpdated,
}) => {
  const notification = useNotification();

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
      notification.error({
        message: ERROR_MESSAGE.CAN_NOT_UPDATE_STATUS,
        showProgress: true,
      });
    }
  };

  return (
    <CardContainer>
      <Header>
        <div>Appointment #{data.id}</div>
        <div>{currentStatus.replace("_", " ")}</div>
      </Header>
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
        <SectionBox>
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
        </SectionBox>

        <SectionBox>
          <SectionTitle>Parts</SectionTitle>
          <ListWrapper>
            {data.parts?.length ? (
              <ul>
                {data.parts.map((p, idx) => {
                  const damage =
                    damageLevels[p.id] ?? DamageLevelEnum.NotAssessed;
                  return (
                    <PartItem key={idx}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
                      <span>
                        {p.name} × {p.quantity} — {p.price.toLocaleString()}₫
                      </span>
                      <DamageLevelBadgeStyled $level={damage}>
                        {DamageLevelLabels[damage]}
                      </DamageLevelBadgeStyled>
                    </PartItem>
                  );
                })}
              </ul>
            ) : (
              <div className="empty">No parts</div>
            )}
          </ListWrapper>
        </SectionBox>
      </ListSection>
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

export default AppointmentCard;
