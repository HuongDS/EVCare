import React from "react";
import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";

const TechnicianDefaultLayout: React.FC = () => <EmployeeLayout role={RoleEnum.TECHNICIAN} />;

export default TechnicianDefaultLayout;
