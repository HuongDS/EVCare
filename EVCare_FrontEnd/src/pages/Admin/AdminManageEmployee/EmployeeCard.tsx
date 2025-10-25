import React from "react";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { EmployeeStatusEnum, RoleEnum } from "../../../models/enums";
import { FaEnvelope, FaPhone, FaIdCard, FaStar } from "react-icons/fa";

import {
  CardWrapper,
  Header,
  Avatar,
  Info,
  NameRow,
  Name,
  RoleBadge,
  BannedBadge,
  StatusBadge,
  DetailsList,
  DetailItem,
  DetailIcon,
  TechSection,
  SectionTitle,
  ExperienceBadge,
  SkillsList,
  SkillTag,
  Actions,
  ActionButton,
} from "./Admin_ManageEmployee.styled";

interface Props {
  emp: EmployeeViewModel;
  onBan: (id: number) => void;
}

const renderStatus = (status: EmployeeStatusEnum) => {
  let text = "Unknown";
  switch (status) {
    case EmployeeStatusEnum.Available:
      text = "Available";
      break;
    case EmployeeStatusEnum.Busy:
      text = "Busy";
      break;
    case EmployeeStatusEnum.OnLeave:
      text = "On Leave";
      break;
  }

  return (
    <StatusBadge $status={status}>
      <span className="status-dot" />
      <span>{text}</span>
    </StatusBadge>
  );
};

const EmployeeCard: React.FC<Props> = ({ emp, onBan }) => {
  return (
    <CardWrapper $isBanned={emp.isBanned}>
      <Header>
        <Avatar
          src={emp.avatar || `https://ui-avatars.com/api/?name=${emp.fullName}&background=00ad4e&color=fff`}
          alt={emp.fullName}
        />
        <Info>
          <NameRow>
            <Name>{emp.fullName}</Name>
            <RoleBadge $role={emp.role}>{emp.role}</RoleBadge>
            {emp.isBanned && <BannedBadge>Banned</BannedBadge>}
          </NameRow>
          {renderStatus(emp.status)}
        </Info>
      </Header>

      <DetailsList>
        <DetailItem>
          <DetailIcon>
            <FaEnvelope />
          </DetailIcon>
          <span>{emp.email}</span>
        </DetailItem>
        <DetailItem>
          <DetailIcon>
            <FaPhone />
          </DetailIcon>
          <span>{emp.phone ?? "N/A"}</span>
        </DetailItem>
        <DetailItem>
          <DetailIcon>
            <FaIdCard />
          </DetailIcon>
          <span>CCCD: {emp.cccd}</span>
        </DetailItem>
      </DetailsList>

      {emp.role === RoleEnum.TECHNICIAN && (
        <TechSection>
          <SectionTitle>Technician Details</SectionTitle>
          <ExperienceBadge>
            <FaStar /> {emp.expYear} years experience
          </ExperienceBadge>
          <SkillsList>
            {emp.skills?.map((s) => (
              <SkillTag key={s.id}>{s.name}</SkillTag>
            ))}
            {(!emp.skills || emp.skills.length === 0) && <SkillTag>No skills listed</SkillTag>}
          </SkillsList>
        </TechSection>
      )}

      <Actions>{!emp.isBanned && <ActionButton onClick={() => onBan(emp.accountId)}>Ban</ActionButton>}</Actions>
    </CardWrapper>
  );
};

export default EmployeeCard;
