import React, { useEffect, useState, type FormEvent } from "react";
import RoleSelector from "../AdminAddEmployee/RoleSelector";
import BasicInfoForm from "../AdminAddEmployee/BasicInfoForm";
import TechnicianFields from "../AdminAddEmployee/TechnicianFields";
import FormActions from "../AdminAddEmployee/FormActions";
import { RoleEnum } from "../../../../models/enums";
import type { EmployeeRegisterDto } from "../../../../models/Employee/EmployeeRegisterDto";
import { useAlert } from "../../../../context/useAlert";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../../constants/messages/Message";
import { addEmployee } from "../../../../services/adminService";
import type { RegisterRequestDto } from "../../../../models/AuthModel/authModel";
import { AdminAddEmployeeWrapper } from "./AdminAddEmployee.styled";
import type { EmployeeSkill } from "../../../../models/Employee/EmployeeSkill";
import type { EmployeeSkillCategoryViewModel } from "../../../../models/Employee/EmployeeSkillCategoryViewModel";
import { useNotification } from "../../../../context/useNotification";
import { getTechnicianCategories } from "../../../../services/technicianCategoryService";
import SpinnerComponent from "../../../../components/SpinnerComponent";

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
  const [selectedSkills, setSelectedSkills] = useState<EmployeeSkill[]>([]);
  const [skillGroups, setSkillGroups] = useState<EmployeeSkillCategoryViewModel[]>([]);
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [searchSkills, setSearchSkills] = useState("");

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

  const handleSelectSkill = (skill: EmployeeSkill) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getTechnicianCategories(searchSkills);
        if (response == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setSkillGroups(response.data?.items || []);
      } catch (error) {
        notification.error({
          message: "Fetch Data",
          description: (error as Error).message,
        });
      }
    };
    fetchData();
    setIsLoading(false);
  }, [searchSkills]);

  return isLoading ? (
    <div style={{ display: "flex", alignItems: "center", height: "100vh", justifyContent: "center" }}>
      <SpinnerComponent />
    </div>
  ) : (
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
                selectedSkills={selectedSkills}
                setSelectedSkills={handleSelectSkill}
                skillGroups={skillGroups}
                setSearchSkills={setSearchSkills}
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
