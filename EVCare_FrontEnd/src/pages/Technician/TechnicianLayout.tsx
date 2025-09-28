import React from "react";
import EmployeeLayout from "../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../models/enums/RoleEnum";

const TechnicianLayout: React.FC = () => {
  return <EmployeeLayout role={RoleEnum.TECHNICIAN} />;
};

export default TechnicianLayout;
