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

interface ApplicationCardProps {
  application: ApplicationResponseDTO;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
  // ✅ Xác định trạng thái
  const getStatus = () => {
    if (application.isApproved === true) return "Approved";
    if (application.isApproved === false) return "Rejected";
    return "Pending";
  };

  const getStatusColor = () => {
    if (application.isApproved === true) return "#16a34a"; // xanh lá
    if (application.isApproved === false) return "#dc2626"; // đỏ
    return "#f59e0b"; // vàng cho pending
  };

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
