import React from "react";
import dayjs from "dayjs";
import type { ApplicationResponseDTO } from "../../../models/ApplicationModel/ApplicationModels";
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
import { ApplicationStatusEnum } from "../../../models/enums/ApplicationStatusEnum";

interface ApplicationCardProps {
  application: ApplicationResponseDTO;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  // ✅ Xác định trạng thái
  const getStatus = () => {
    if (application.isApproved === true) return ApplicationStatusEnum.APPROVED;
    if (application.isApproved === false) return ApplicationStatusEnum.REJECTED;
    return ApplicationStatusEnum.PENDING;
  };

  const statusColors: Record<ApplicationStatusEnum, string> = {
    [ApplicationStatusEnum.PENDING]: "#f59e0b",
    [ApplicationStatusEnum.APPROVED]: "#16a34a",
    [ApplicationStatusEnum.REJECTED]: "#dc2626",
  };

  const getStatusColor = () => statusColors[getStatus()];

  return (
    <CardContainer>
      {/* Header: Status + Date Off */}
      <HeaderSection>
        <DateOff>
          Date Off: {dayjs(application.dateOff).format("YYYY-MM-DD")}
        </DateOff>
        <StatusBadge approvedColor={getStatusColor()}>
          {getStatus()}
        </StatusBadge>
      </HeaderSection>

      {/* Reason + Note side by side */}
      <InfoRow>
        <div>
          <Label>Reason:</Label>
          <InfoBox>{application.reason || "—"}</InfoBox>
        </div>
        <div>
          <Label>Note:</Label>
          <InfoBox>{application.note || "—"}</InfoBox>
        </div>
      </InfoRow>

      {/* Created at */}
      <CreatedAt>
        Created At: {dayjs(application.createdAt).format("YYYY-MM-DD")}
      </CreatedAt>
    </CardContainer>
  );
};

export default ApplicationCard;
