import React, { useEffect, useState, type FormEvent } from "react";
import RoleSelector from "../AdminAddEmployee/RoleSelector";
import BasicInfoForm from "../AdminAddEmployee/BasicInfoForm";
import TechnicianFields from "../AdminAddEmployee/TechnicianFields";
import FormActions from "../AdminAddEmployee/FormActions";
import { RoleEnum } from "../../../../models/enums";
import type { EmployeeRegisterDto } from "../../../../models/Employee/EmployeeRegisterDto";
import { useAlert } from "../../../../context/useAlert";
import {
  ERROR_MESSAGE,
  MSG_TITLE,
} from "../../../../constants/messages/Message";
import { addEmployee } from "../../../../services/adminService";
import type { RegisterRequestDto } from "../../../../models/AuthModel/authModel";
import { AdminAddEmployeeWrapper } from "./AdminAddEmployee.styled";
import type { EmployeeSkillCategoryViewModel } from "../../../../models/Employee/EmployeeSkillCategoryViewModel";
import { useNotification } from "../../../../context/useNotification";
import { getTechnicianCategories } from "../../../../services/technicianCategoryService";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import type { EmployeeSkill } from "../../../../models/Employee/EmployeeSkill";
import type { TechinicianSkillRegistDto } from "../../../../models/Techinician/TechinicianSkillRegisterDto";
import { addSkillToTechnician } from "../../../../services/technicianSkillService";
import { EMAIL_REGEX } from "../../../../constants/regexs/EmailRegex";
import { PASSWORD_REGEX } from "../../../../constants/regexs/PasswordRegex";
import { PHONE_NUMBER_REGEX } from "../../../../constants/regexs/PhoneNumberRegex";

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
  const [skillGroups, setSkillGroups] = useState<
    EmployeeSkillCategoryViewModel[]
  >([]);
  const notification = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [searchSkills, setSearchSkills] = useState("");
  const [addImage, setAddImage] = useState("");
  const [technicianId, setTechnicianId] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [searchedSkillList, setSearchSkillList] = useState<
    EmployeeSkillCategoryViewModel[]
  >([]);

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      if (firstName == null || lastName == null) {
        throw new Error(ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED);
      } else if (firstName.trim().length == 0 || lastName.trim().length == 0) {
        throw new Error(
          "firstName and lastName" + ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED
        );
      } else if (!EMAIL_REGEX.test(email)) {
        throw new Error(ERROR_MESSAGE.INVALID_EMAIL);
      } else if (
        !PASSWORD_REGEX.test(password) ||
        !PASSWORD_REGEX.test(confirmPassword)
      ) {
        throw new Error(ERROR_MESSAGE.INVALID_PASSWORD);
      } else if (!PHONE_NUMBER_REGEX.test(phone)) {
        throw new Error(ERROR_MESSAGE.INVALID_PHONE);
      } else if (password !== confirmPassword) {
        throw new Error(
          ERROR_MESSAGE.PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME
        );
      } else if (CCCD == null || CCCD.length == 0) {
        throw new Error("CCCD" + ERROR_MESSAGE.THIS_FIELD_IS_REQUIRED);
      }

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
        avatar: addImage,
      };

      const response = await addEmployee(newDataToRegist);
      if (response == null) {
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
      if (selectedRole == RoleEnum.TECHNICIAN) {
        if (expYear == 0) {
          throw new Error("ExpYear must be bigger than 0");
        }
        setTechnicianId(response.data ?? 0);
        const data: TechinicianSkillRegistDto = {
          technicianId: response.data ?? technicianId,
          serviceIds: selectedSkills.map((sk) => sk.id),
        };
        await addSkillToTechnician(data);
      }
      notification.success({
        message: MSG_TITLE.ADD_EMPLOYEE,
        description: "Add new Employee successfully !",
        showProgress: true,
      });
    } catch (error) {
      showAlert("error", MSG_TITLE.ADD_EMPLOYEE, (error as Error).message);
      return;
    } finally {
      setFirstName("");
      setLastName("");
      setCCCD("");
      setPassword("");
      setConfirmPassword("");
      setPhone("");
      setEmail("");
      setExpYear(0);
      setSelectedSkills([]);
      setSkillGroups([]);
      setTechnicianId(0);
      setIsSubmit(false);
    }
  };

  const handleSelectSkill = (skill: EmployeeSkill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getTechnicianCategories();
        if (response == null) {
          throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
        }
        setSkillGroups(response.data ?? []);
        setSearchSkillList(response.data ?? []);
      } catch (error) {
        notification.error({
          message: "Fetch Data",
          description: (error as Error).message,
          showProgress: true,
        });
      }
    };
    fetchData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchSkills.trim() === "") {
      setSearchSkillList(skillGroups);
      return;
    }
    const filteredList = skillGroups.map((group) => {
      const filteredServices = group.services.filter((service) =>
        service.name
          .toLocaleLowerCase()
          .includes(searchSkills.toLocaleLowerCase().trim())
      );
      return {
        ...group,
        services: filteredServices,
      };
    });
    setSearchSkillList(filteredList);
  }, [searchSkills, skillGroups]);

  return isLoading ? (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <SpinnerComponent />
    </div>
  ) : (
    <AdminAddEmployeeWrapper>
      <div className="add-employee-page">
        <div className="main-content">
          <div className="form-container">
            <form>
              {/* <form onSubmit={handleSubmit}> */}
              <RoleSelector
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />

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
                setAddImage={setAddImage}
              />

              <TechnicianFields
                show={selectedRole === RoleEnum.TECHNICIAN}
                expYear={expYear}
                handleChange={setExpYear}
                selectedSkills={selectedSkills}
                setSelectedSkills={handleSelectSkill}
                skillGroups={searchedSkillList}
                setSearchSkills={setSearchSkills}
              />

              <FormActions
                isSubmit={isSubmit}
                onSubmit={handleSubmit}
                onCancel={() => window.history.back()}
              />
            </form>
          </div>
        </div>
      </div>
    </AdminAddEmployeeWrapper>
  );
};

export default AddEmployee;
