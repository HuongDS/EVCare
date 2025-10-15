import { Modal } from "antd";
import {
  getAppointmentStepFromStatus,
  ProgressSteps,
  stepsAppointment,
} from "../../../components/ProgressStep/ProgressStep";
import Appointment_CheckIn from "./Appointment_CheckIn";
import styled from "styled-components";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { useAppSelector } from "../../../states/store";
import AssignTechnicianPage from "./Appointment_Assign";
import Appointment_Part_Tracking from "./Appointment_Part_Tracking";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import PaymentPage from "./Appointment_Payment";
import { InvoicePage } from "./Appointment_Invoice";

const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  top: 2%;
  .ant-modal-content {
    width: 1000px !important;
    height: 95vh !important;
  }
`;

interface props {
  show: boolean;
  close: () => void;
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
}

export default function Appoinment_Progress_Modal({
  show,
  close,
  data,
}: props) {
  //Các step title trong quy trình appoinments
  const stepNames = stepsAppointment;

  const currentStep = useAppSelector((state) => {
    const savedStep = state.appointments[data.id];
    return savedStep ?? getAppointmentStepFromStatus(data.status);
  });

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <Appointment_CheckIn data={data} currentStep={currentStep} />;
      case 1:
        return <AssignTechnicianPage data={data} currentStep={currentStep} />;
      case 2:
        return (
          <Appointment_Part_Tracking
            data={data}
            currentStep={currentStep}
            closeModal={close}
          />
        );
      case 3:
        return <PaymentPage data={data} currentStep={currentStep} />;
      case 5:
        return <InvoicePage data={data} />;
    }
  };

  return (
    <ModalStyled open={show} onCancel={close} footer={null}>
      <ProgressSteps steps={stepNames} currentStep={currentStep}>
        <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
          {renderContent()}
        </div>
      </ProgressSteps>
    </ModalStyled>
  );
}
