import React, { useState, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import { updateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { getAppointmentPartCondition } from "../../../services/appointmentPartCondition";
import { fetchTechnicianAddedParts } from "../../../services/getTechnicianOrder";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { DamageLevelEnum, DamageLevelLabels, DamageLevelStringEnum } from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";
import { useNotification } from "../../../context/useNotification";
import { useQuery } from "@tanstack/react-query";

import {
  CardWrapper,
  CardHeader,
  StatusBadge,
  CardBody,
  InfoItem,
  ImageCarousel,
  ImageItem,
  ListSection,
  SectionBox,
  SectionTitle,
  SubTitle,
  ListWrapper,
  DamageLevelBadgeStyled,
  ButtonWrapper,
  PartsTable,
  ServicePillContainer,
  ServicePill,
} from "./Style/TechnicianAppointmentCard.styled";

import SpinnerComponent from "../../../components/SpinnerComponent";
import { FaUser, FaCar, FaCalendarAlt, FaPhone, FaWrench, FaTools } from "react-icons/fa";

type Props = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (orderId: number, newStatus: TechnicianWorkingSessionEnum) => void;
  onPartsUpdated?: (orderId: number) => void;
};

const TechnicianAppointmentCard: React.FC<Props> = ({ data, onStatusChange, onPartsUpdated }) => {
  const notification = useNotification();
  const [currentStatus, setCurrentStatus] = useState<TechnicianWorkingSessionEnum>(
    data.status as TechnicianWorkingSessionEnum
  );
  const [damageLevels, setDamageLevels] = useState<Record<number, DamageLevelEnum>>({});

  const {
    data: parts = [],
    isLoading: isLoadingParts,
    refetch: refetchParts,
  } = useQuery({
    queryKey: ["TechnicianAddedParts", data.orderId],
    queryFn: () => fetchTechnicianAddedParts(data.orderId),
    enabled: !!data.orderId,
  });

  useEffect(() => {
    const fetchDamageLevels = async () => {
      try {
        const response = await getAppointmentPartCondition(data.id);
        const map: Record<number, DamageLevelEnum> = {};
        response.data?.partDamageLevels?.forEach((d) => {
          switch (d.damageLevel) {
            case DamageLevelStringEnum.Minor:
              map[d.partId] = DamageLevelEnum.Minor;
              break;
            case DamageLevelStringEnum.Moderate:
              map[d.partId] = DamageLevelEnum.Moderate;
              break;
            case DamageLevelStringEnum.Severe:
              map[d.partId] = DamageLevelEnum.Severe;
              break;
            case DamageLevelStringEnum.Critical:
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
      await refetchParts();
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

  useEffect(() => {
    setCurrentStatus(data.status as TechnicianWorkingSessionEnum);
  }, [data.status]);

  return (
    <CardWrapper $status={currentStatus}>
      <CardHeader>
        <div className="id-badge">Appointment #{data.id}</div>
        <h3>{data.customerName}</h3>
        <StatusBadge $status={currentStatus}>{currentStatus.replace("_", " ")}</StatusBadge>
      </CardHeader>

      <CardBody>
        <InfoItem>
          <FaUser />
          <span>{data.customerName}</span>
        </InfoItem>
        <InfoItem>
          <FaCar />
          <span>
            {data.vehicleModel} ({data.licensePlate})
          </span>
        </InfoItem>
        <InfoItem>
          <FaPhone />
          <span>{data.phoneNumber ?? "N/A"}</span>
        </InfoItem>
        <InfoItem>
          <FaCalendarAlt />
          <span>{formatDate(data.appointmentDate)}</span>
        </InfoItem>
      </CardBody>

      {data.appointmentImages?.length > 0 && (
        <ImageCarousel>
          {data.appointmentImages.map((img, idx) => (
            <ImageItem key={idx}>
              <img src={img} alt={`appointment-${idx}`} />
            </ImageItem>
          ))}
        </ImageCarousel>
      )}

      <ListSection>
        <SectionBox>
          <SectionTitle>
            <FaWrench /> Services
          </SectionTitle>
          <ListWrapper>
            {data.services?.length ? (
              <ServicePillContainer>
                {data.services.map((s, idx) => (
                  <ServicePill key={idx}>{s}</ServicePill>
                ))}
              </ServicePillContainer>
            ) : (
              <div className="empty">No services requested</div>
            )}
          </ListWrapper>
        </SectionBox>

        <SectionBox>
          <SectionTitle>
            <FaTools /> Parts
            <SubTitle>Only the parts you have added</SubTitle>
          </SectionTitle>
          <ListWrapper>
            {isLoadingParts ? (
              <SpinnerComponent />
            ) : parts.length > 0 ? (
              <PartsTable>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Damage Level</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p) => (
                    <tr key={p.partID}>
                      <td>{p.partName}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price.toLocaleString()}₫</td>
                      <td>
                        <DamageLevelBadgeStyled $level={damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed}>
                          {DamageLevelLabels[damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed]}
                        </DamageLevelBadgeStyled>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PartsTable>
            ) : (
              <div className="empty">No parts added</div>
            )}
          </ListWrapper>
        </SectionBox>
      </ListSection>

      <ButtonWrapper>
        <ReviewButton status={currentStatus} onAction={handleAction} appointment={data} orderId={data.orderId} />
      </ButtonWrapper>
    </CardWrapper>
  );
};

export default TechnicianAppointmentCard;
