import React, { useState } from "react";
import EmployeeLayout from "../../../components/Layouts/EmployeeLayout";
import { RoleEnum } from "../../../models/enums";
import { TechnicianOrderMenu } from "./OrderMenu";
import TechnicianOrder from "../TechnicianOrder/Technician_Order";

const TechnicianOrderLayout: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <EmployeeLayout
      role={RoleEnum.TECHNICIAN}
      menuOverride={
        <TechnicianOrderMenu
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      }
    >
      <TechnicianOrder selectedCategory={selectedCategory} />
    </EmployeeLayout>
  );
};

export default TechnicianOrderLayout;
