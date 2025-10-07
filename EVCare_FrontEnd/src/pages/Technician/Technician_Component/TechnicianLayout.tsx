import React from "react";
import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";

export const TechnicianDefaultLayout: React.FC = () => (
  <EmployeeLayout role={RoleEnum.TECHNICIAN} />
);
