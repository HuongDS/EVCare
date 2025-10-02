import React from "react";
import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";

const AdminLayout: React.FC = () => {
  return <EmployeeLayout role={RoleEnum.ADMIN} />;
};

export default AdminLayout;
