import styled from "styled-components";
import StatusTag from "../../../components/StatusTags/StatusTag";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { formatDate } from "../../../utils/formatDate";
import logo from "../../../assets/EVCare.png";
import {
  TriangleAlert,
  Calendar,
  User,
  Phone,
  Car,
  Wrench,
  Eye,
  RefreshCw,
  Info,
} from "lucide-react";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { Tooltip } from "antd";
import { formatPlateNumber } from "../../../utils/formatPlateNumber";

type AppointmentCardProps = {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  onOpenProgress: () => void;
  hasTechnicianOnleave: boolean;
  onOpenReassign: () => void;
  setShowDetail: (v: boolean) => void;
  setDetailAppointment: (
    v: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
  ) => void;
};

export default function AppointmentCard({
  data,
  onOpenProgress,
  hasTechnicianOnleave,
  onOpenReassign,
  setShowDetail,
  setDetailAppointment,
}: AppointmentCardProps) {
  return (
    <CardContainer>
      <CardHeader>
        <LeftSection>
          <AppointmentId>#{data.id}</AppointmentId>
          <StatusTag status={data.status} />
        </LeftSection>
        <DateSection>
          <Calendar size={16} />
          {formatDate(data.appointmentDate)}
          <Tooltip
            title="View the appointment's information"
            placement="left"
            color="#00ad4e"
          >
            <Info
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setDetailAppointment(data);
                setShowDetail(true);
              }}
            />
          </Tooltip>
        </DateSection>
      </CardHeader>

      <CardBody>
        <VehicleImage>
          <img
            src={
              data.appointmentImages && data.appointmentImages.length > 0
                ? data.appointmentImages[0]
                : logo
            }
            alt="Vehicle"
          />
        </VehicleImage>

        <InfoSection>
          <InfoRow>
            <InfoItem>
              <IconLabel>
                <User size={14} />
                Customer
              </IconLabel>
              <InfoValue>{data.customerName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <IconLabel>
                <Phone size={14} />
                Phone
              </IconLabel>
              <InfoValue>{data.phoneNumber ?? "N/A"}</InfoValue>
            </InfoItem>
          </InfoRow>

          <InfoRow>
            <InfoItem>
              <IconLabel>
                <Car size={14} />
                Vehicle
              </IconLabel>
              <InfoValue>{data.vehicleModel}</InfoValue>
            </InfoItem>
            <InfoItem>
              <IconLabel>License</IconLabel>
              <InfoValue>{formatPlateNumber(data.licensePlate)}</InfoValue>
            </InfoItem>
          </InfoRow>
        </InfoSection>

        <ServicesSection>
          <ServiceLabel>
            <Wrench size={14} />
            Services
          </ServiceLabel>
          <ServicesList>
            {data.services.slice(0, 2).map((service, i) => (
              <ServiceTag key={i}>{service.name}</ServiceTag>
            ))}
            {data.services.length > 2 && (
              <MoreTag>+{data.services.length - 2}</MoreTag>
            )}
          </ServicesList>
        </ServicesSection>

        <ActionsSection>
          {data.status === "Done" ? (
            <ActionButton $variant="primary" onClick={onOpenProgress}>
              <Eye size={16} />
              View Details
            </ActionButton>
          ) : data.status !== "Pending" && data.status !== "Canceled" ? (
            data.status === "AddingPart" ? (
              <ActionButton $variant="primary" onClick={onOpenProgress}>
                <RefreshCw size={16} />
                View
              </ActionButton>
            ) : (
              <ActionButton $variant="primary" onClick={onOpenProgress}>
                <RefreshCw size={16} />
                Progress
              </ActionButton>
            )
          ) : null}

          {data.status === "InProgress" &&
            data.orderStatus === "Processing" && (
              <ActionButton
                $variant={hasTechnicianOnleave ? "warning" : "secondary"}
                onClick={onOpenReassign}
              >
                {hasTechnicianOnleave && <TriangleAlert size={16} />}
                Re-Assign
              </ActionButton>
            )}
        </ActionsSection>
      </CardBody>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 2px solid #f0f0f0;
  margin: 12px;
  overflow: hidden;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.15);
    border-color: #00ad4e;
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f8fdf9 0%, #e8f5e9 100%);
  border-bottom: 2px solid #e8f5e9;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AppointmentId = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
`;

const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
  font-weight: 600;

  svg {
    color: #00ad4e;
  }
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto auto;
  gap: 16px;
  padding: 16px;
  align-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: 100px 1fr;
    gap: 12px;
  }
`;

const VehicleImage = styled.div`
  width: 120px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e8f5e9;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 1200px) {
    width: 100px;
    height: 75px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 1200px) {
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;

  svg {
    color: #00ad4e;
  }
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ServicesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;

  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    min-width: auto;
  }
`;

const ServiceLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;

  svg {
    color: #00ad4e;
  }
`;

const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ServiceTag = styled.span`
  padding: 4px 10px;
  background: #e8f5e9;
  color: #00ad4e;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  white-space: nowrap;
`;

const MoreTag = styled(ServiceTag)`
  background: #f5f5f5;
  color: #666;
`;

const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 140px;

  @media (max-width: 1200px) {
    grid-column: 1 / -1;
    flex-direction: row;
    min-width: auto;
  }
`;

const ActionButton = styled.button<{
  $variant: "primary" | "secondary" | "warning";
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return `
          background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(0, 173, 78, 0.3);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 173, 78, 0.4);
          }
        `;
      case "secondary":
        return `
          background: #1da1f2;
          color: white;
          box-shadow: 0 2px 8px rgba(29, 161, 242, 0.3);

          &:hover {
            background: #1a8cd8;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(29, 161, 242, 0.4);
          }
        `;
      case "warning":
        return `
          background: #FFC72C;
          color: #333;
          box-shadow: 0 2px 8px rgba(255, 199, 44, 0.3);

          &:hover {
            background: #ffb700;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 199, 44, 0.4);
          }
        `;
    }
  }}

  &:active {
    transform: translateY(0);
  }
`;
