import React, { useState, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { getAppointmentPartCondition } from "../../../services/appointmentPartCondition";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import {
  DamageLevelEnum,
  DamageLevelLabels,
} from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";
import { useNotification } from "../../../context/useNotification";
import { getTechnicianAddedParts } from "../../../services/getTechnicianOrder";

type Props = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (
    orderId: number,
    newStatus: TechnicianWorkingSessionEnum
  ) => void;
  onPartsUpdated?: (orderId: number) => void;
};
import {
  CardContainer,
  Header,
  ImageCarousel,
  ImageItem,
  InfoBox,
  InfoColumn,
  ListSection,
  SectionBox,
  SectionTitle,
  ListWrapper,
  PartItem,
  DamageLevelBadgeStyled,
  ButtonWrapper,
  SubTitle,
} from "./Style/AppointmentCard.styled";

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

  const { data: addedPartsResponse, isLoading: isLoadingParts } =
    getTechnicianAddedParts(data.orderId);

  const parts: any[] = addedPartsResponse?.data ?? [];

  useEffect(() => {
    const fetchDamageLevels = async () => {
      try {
        await new Promise((res) => setTimeout(res, Math.random() * 300));

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
          <SectionTitle>
            Parts
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
