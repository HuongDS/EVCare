import React from "react";
import MainLayout from "./MainLayout";
import { RoleEnum } from "../../models/enums/RoleEnum";

const TechnicianLayout: React.FC = () => {
  return <MainLayout role={RoleEnum.TECHNICIAN} />;
};

export default TechnicianLayout;
