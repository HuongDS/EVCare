import React, { useState, type FormEvent } from "react";
import RoleSelector from "../AdminAddEmployee/RoleSelector";
import BasicInfoForm from "../AdminAddEmployee/BasicInfoForm";
import TechnicianFields from "../AdminAddEmployee/TechnicianFields";
import FormActions from "../AdminAddEmployee/FormActions";
import { RoleEnum } from "../../../../models/enums";
import type { EmployeeRegisterDto } from "../../../../models/Employee/EmployeeRegisterDto";
import { useAlert } from "../../../../context/useAlert";
import { MSG_TITLE } from "../../../../constants/messages/Message";
import { addEmployee } from "../../../../services/adminService";
import type { RegisterRequestDto } from "../../../../models/AuthModel/authModel";
import { AdminAddEmployeeWrapper } from "./AdminAddEmployee.styled";

const AddEmployee: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleEnum>(RoleEnum.STAFF);
  const { showAlert } = useAlert();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [CCCD, setCCCD] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [expYear, setExpYear] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const accountInfo: RegisterRequestDto = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
    };

    const newDataToRegist: EmployeeRegisterDto = {
      expYear: expYear,
      role: selectedRole,
      CCCD: CCCD,
      accountInfo: accountInfo,
    };

    try {
      await addEmployee(newDataToRegist);
      showAlert("success", MSG_TITLE.ADD_EMPLOYEE, "Add new Employee successfully !");
    } catch (error) {
      showAlert("error", MSG_TITLE.ADD_EMPLOYEE, (error as Error).message);
      return;
    }

    showAlert("success", MSG_TITLE.ADD_EMPLOYEE, "Added Successfully!");
  };

  return (
    <AdminAddEmployeeWrapper>
      <div className="add-employee-page">
        <div className="main-content">
          <div className="form-container">
            <form>
              {/* <form onSubmit={handleSubmit}> */}
              <RoleSelector selectedRole={selectedRole} setSelectedRole={setSelectedRole} />

              <BasicInfoForm
                firstName={firstName}
                lastName={lastName}
                email={email}
                phone={phone}
                password={password}
                confirmPassword={confirmPassword}
                selectedRole={selectedRole}
                CCCD={CCCD}
                setFirstName={setFirstName}
                setLastName={setLastName}
                setEmail={setEmail}
                setPassword={setPassword}
                setConfirmPassword={setConfirmPassword}
                setSelectedRole={setSelectedRole}
                setCCCD={setCCCD}
                setPhone={setPhone}
              />

              <TechnicianFields
                show={selectedRole === RoleEnum.TECHNICIAN}
                expYear={expYear}
                handleChange={setExpYear}
              />

              <FormActions onSubmit={handleSubmit} onCancel={() => window.history.back()} />
            </form>
          </div>
        </div>
      </div>
    </AdminAddEmployeeWrapper>
  );
};

export default AddEmployee;
