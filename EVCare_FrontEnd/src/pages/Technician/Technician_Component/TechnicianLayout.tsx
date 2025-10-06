import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";
import { technicianOrderMenu } from "./OrderMenu";

export const TechnicianDefaultLayout = () => (
  <EmployeeLayout role={RoleEnum.TECHNICIAN} />
);

export const TechnicianOrderLayout = () => (
  <EmployeeLayout
    role={RoleEnum.TECHNICIAN}
    menuOverride={technicianOrderMenu}
  />
);
