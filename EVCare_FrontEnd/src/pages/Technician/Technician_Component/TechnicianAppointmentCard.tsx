import React, { useState, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import { useUpdateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { useGetAppointmentPartCondition } from "../../../services/appointmentPartCondition";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { DamageLevelEnum } from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";
import { useNotification } from "../../../context/useNotification";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { User, Car, Calendar, Phone, Wrench, Package, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";

type Props = {
  data: TechnicianAppointmentsDto;
  onStatusChange?: (orderId: number, newStatus: TechnicianWorkingSessionEnum) => void;
  onPartsUpdated?: (orderId: number) => void;
  setIsOrder: (v: boolean) => void;
};

const TechnicianAppointmentCard: React.FC<Props> = ({ data, onStatusChange, onPartsUpdated, setIsOrder }) => {
  const notification = useNotification();
  const [currentStatus, setCurrentStatus] = useState<TechnicianWorkingSessionEnum>(data.status);
  const [expandedSections, setExpandedSections] = useState({
    images: false,
    services: false,
  });

  const { mutateAsync: updateWorkingSession } = useUpdateTechnicianWorkingSession();
  const { data: appointment, isLoading } = useGetAppointmentPartCondition(data.id);

  // assume dung
  const handleChangeStatusWorkingSession = async (nextStatus: TechnicianWorkingSessionEnum) => {
    const prevStatus = currentStatus;
    setCurrentStatus(nextStatus);
    onStatusChange?.(data.orderId, nextStatus);
    try {
      await updateWorkingSession({
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

  useEffect(() => {
    setCurrentStatus(data.status as TechnicianWorkingSessionEnum);
  }, [data.status]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <CardContainer>
      <CardHeader>
        <HeaderLeft>
          <AppointmentId>#{data.id}</AppointmentId>
          <StatusBadge $status={currentStatus}>{currentStatus.replace("_", " ")}</StatusBadge>
        </HeaderLeft>
        <HeaderRight>
          <ReviewButton onChangeStatus={handleChangeStatusWorkingSession} appointment={data} setIsOrder={setIsOrder} />
        </HeaderRight>
      </CardHeader>

      <ContentWrapper>
        <CardBody>
          <InfoGrid>
            <InfoItem>
              <InfoIcon>
                <User size={16} />
              </InfoIcon>
              <InfoText>
                <InfoLabel>Customer</InfoLabel>
                <InfoValue>{data.customerName}</InfoValue>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <Car size={16} />
              </InfoIcon>
              <InfoText>
                <InfoLabel>Vehicle</InfoLabel>
                <InfoValue>{data.vehicleModel}</InfoValue>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <Phone size={16} />
              </InfoIcon>
              <InfoText>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{data.phoneNumber ?? "N/A"}</InfoValue>
              </InfoText>
            </InfoItem>

            <InfoItem>
              <InfoIcon>
                <Calendar size={16} />
              </InfoIcon>
              <InfoText>
                <InfoLabel>Date</InfoLabel>
                <InfoValue>{formatDate(data.appointmentDate)}</InfoValue>
              </InfoText>
            </InfoItem>
          </InfoGrid>

          {data.appointmentImages?.length > 0 && (
            <CollapsibleSection>
              <SectionHeader onClick={() => toggleSection("images")}>
                <SectionTitle>
                  <ImageIcon size={18} />
                  Images ({data.appointmentImages.length})
                </SectionTitle>
                {expandedSections.images ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </SectionHeader>
              {expandedSections.images && (
                <ImageGrid>
                  {data.appointmentImages.map((img, idx) => (
                    <ImageThumb key={idx} src={img} alt={`img-${idx}`} />
                  ))}
                </ImageGrid>
              )}
            </CollapsibleSection>
          )}

          <CollapsibleSection>
            <SectionHeader onClick={() => toggleSection("services")}>
              <SectionTitle>
                <Wrench size={18} />
                Services ({data.services?.length || 0})
              </SectionTitle>
              {expandedSections.services ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </SectionHeader>
            {expandedSections.services && (
              <ServiceList>
                {data.services?.length ? (
                  data.services.map((s, idx) => <ServiceTag key={idx}>{s}</ServiceTag>)
                ) : (
                  <EmptyText>No services</EmptyText>
                )}
              </ServiceList>
            )}
          </CollapsibleSection>
        </CardBody>
        <PartSection>
          <SectionHeader>
            <SectionTitle>
              <Package size={18} />
              Parts Added ({appointment?.data?.partDamageLevels?.length || 0})
            </SectionTitle>
          </SectionHeader>
          <PartsContainer>
            {isLoading ? (
              <SpinnerComponent />
            ) : (appointment?.data?.partDamageLevels?.length || 0) > 0 ? (
              <PartsTable>
                <thead>
                  <tr>
                    <th>Part</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Damage</th>
                  </tr>
                </thead>
                <tbody>
                  {appointment?.data?.partDamageLevels.map((p) => (
                    <tr key={p.partId}>
                      <td>{p.partName}</td>
                      <td>{p.quantity}</td>
                      <td>{p.price.toLocaleString()}₫</td>
                      <td>
                        <DamageBadge $level={p.damageLevel ?? DamageLevelEnum.NotAssessed}>
                          {p.damageLevel || DamageLevelEnum.NotAssessed}
                        </DamageBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PartsTable>
            ) : (
              <EmptyText>No parts added</EmptyText>
            )}
          </PartsContainer>
        </PartSection>
      </ContentWrapper>
    </CardContainer>
  );
};

export default TechnicianAppointmentCard;

import {
  AppointmentId,
  CardBody,
  CardContainer,
  CardHeader,
  HeaderRight,
  CollapsibleSection,
  ContentWrapper,
  DamageBadge,
  EmptyText,
  HeaderLeft,
  ImageGrid,
  ImageThumb,
  InfoGrid,
  InfoIcon,
  InfoItem,
  InfoLabel,
  InfoText,
  InfoValue,
  PartsContainer,
  PartsTable,
  PartSection,
  SectionHeader,
  SectionTitle,
  ServiceList,
  ServiceTag,
  StatusBadge,
} from "./Style/TechnicianAppointmentCard.styled";
