import React from "react";
import dayjs from "dayjs";
import type { ApplicationResponseDTO } from "../../models/ApplicationModel/ApplicationModels";
import {
  CardContainer,
  HeaderSection,
  StatusBadge,
  DateOff,
  InfoRow,
  Label,
  InfoBox,
  CreatedAt,
} from "./ApplicationCard.styled";
import { ApplicationStatusEnum } from "../../models/enums/ApplicationStatusEnum";

interface ApplicationCardProps {
  application: ApplicationResponseDTO;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  const getStatus = () => {
    switch (application.status?.toLowerCase()) {
      case "approved":
        return ApplicationStatusEnum.APPROVED;
      case "rejected":
        return ApplicationStatusEnum.REJECTED;
      default:
        return ApplicationStatusEnum.PENDING;
    }
  };

  const statusColors: Record<ApplicationStatusEnum, string> = {
    [ApplicationStatusEnum.PENDING]: "#f59e0b",
    [ApplicationStatusEnum.APPROVED]: "#16a34a",
    [ApplicationStatusEnum.REJECTED]: "#dc2626",
  };

  const getStatusColor = () => statusColors[getStatus()];

  return (
    <CardContainer>
      <HeaderSection>
        <DateOff>
          Date Off: {dayjs(application.dateOff).format("YYYY-MM-DD")}
        </DateOff>
        <StatusBadge $approvedColor={getStatusColor()}>
          {getStatus()}
        </StatusBadge>
      </HeaderSection>
      <InfoRow>
        <div>
          <Label>Reason:</Label>
          <InfoBox
            dangerouslySetInnerHTML={{
              __html: application.reason || "—",
            }}
          />
        </div>
        <div>
          <Label>Note:</Label>
          <InfoBox
            dangerouslySetInnerHTML={{
              __html: application.note || "—",
            }}
          />
        </div>
      </InfoRow>

      <CreatedAt>
        Created At: {dayjs(application.createdAt).format("YYYY-MM-DD")}
      </CreatedAt>
    </CardContainer>
  );
};

export default ApplicationCard;
