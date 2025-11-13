import React, { useState, useEffect } from "react";
import { formatDate } from "../../../utils/formatDate";
import { useUpdateTechnicianWorkingSession } from "../../../services/TechnicianWorkingSessionApi";
import { getAppointmentPartCondition } from "../../../services/appointmentPartCondition";
import { fetchTechnicianAddedParts } from "../../../services/getTechnicianOrder";
import type { TechnicianAppointmentsDto } from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { TechnicianWorkingSessionEnum } from "../../../models/enums/TechnicianWorkingSessionEnum";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";
import { DamageLevelEnum, DamageLevelLabels, DamageLevelStringEnum } from "../../../models/enums/DamageLevelEnum";
import ReviewButton from "./Button";
import { useNotification } from "../../../context/useNotification";
import { useQuery } from "@tanstack/react-query";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { User, Car, Calendar, Phone, Wrench, Package, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState({
    images: false,
    services: false,
    parts: false,
  });

  // call api o day de lay service

  const { mutateAsync: updateWorkingSession } = useUpdateTechnicianWorkingSession();

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
      await updateWorkingSession({
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
      </CardHeader>

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

        {/* Images Section */}
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

        {/* Services Section */}
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

        {/* Parts Section */}
        <CollapsibleSection>
          <SectionHeader onClick={() => toggleSection("parts")}>
            <SectionTitle>
              <Package size={18} />
              Parts Added ({parts.length})
            </SectionTitle>
            {expandedSections.parts ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </SectionHeader>
          {expandedSections.parts && (
            <PartsContainer>
              {isLoadingParts ? (
                <SpinnerComponent />
              ) : parts.length > 0 ? (
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
                    {parts.map((p) => (
                      <tr key={p.partID}>
                        <td>{p.partName}</td>
                        <td>{p.quantity}</td>
                        <td>{p.price.toLocaleString()}₫</td>
                        <td>
                          <DamageBadge $level={damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed}>
                            {DamageLevelLabels[damageLevels[p.partID] ?? DamageLevelEnum.NotAssessed]}
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
          )}
        </CollapsibleSection>
      </CardBody>

      <CardFooter>
        <ReviewButton status={currentStatus} onAction={handleAction} appointment={data} orderId={data.orderId} />
      </CardFooter>
    </CardContainer>
  );
};

export default TechnicianAppointmentCard;

import {
  AppointmentId,
  CardBody,
  CardContainer,
  CardFooter,
  CardHeader,
  CollapsibleSection,
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
  SectionHeader,
  SectionTitle,
  ServiceList,
  ServiceTag,
  StatusBadge,
} from "./Style/TechnicianAppointmentCard.styled";
