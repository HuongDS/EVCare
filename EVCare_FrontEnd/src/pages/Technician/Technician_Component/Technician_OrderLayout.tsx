import React from "react";
import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";

const TechnicianOrderLayout: React.FC = () => {
  return <EmployeeLayout role={RoleEnum.TECHNICIAN} />;
};

export default TechnicianOrderLayout;
