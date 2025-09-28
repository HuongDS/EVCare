import React from "react";
import MainLayout from "./EmployeeLayout";
import { RoleEnum } from "../../models/enums/RoleEnum";

const StaffLayout: React.FC = () => {
  return <MainLayout role={RoleEnum.STAFF} />;
};

export default StaffLayout;
