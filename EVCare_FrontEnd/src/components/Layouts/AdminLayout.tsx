import React from "react";
import MainLayout from "./MainLayout";
import { RoleEnum } from "../../models/enums/RoleEnum";

const AdminLayout: React.FC = () => {
  return <MainLayout role={RoleEnum.ADMIN} />;
};

export default AdminLayout;
