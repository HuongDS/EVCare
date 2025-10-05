import { Modal } from "antd";
import {
  getAppointmentStepFromStatus,
  ProgressSteps,
  stepsAppoinment,
} from "../../../components/ProgressStep/ProgressStep";
import Appointment_CheckIn from "./Appointment_CheckIn";
import styled from "styled-components";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import { useAppSelector } from "../../../states/store";
import AssignTechnicianPage from "./Appointment_Assign";
import PaymentDemo from "./Appointment_Order";
import InvoiceDemo from "./Appointment_Details";

const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  top: 2%;
  .ant-modal-content {
    width: 1000px !important;
    height: 90vh !important;
  }
`;

interface props {
  show: boolean;
  close: () => void;
  data: StaffAppointmentsDto;
}

export default function Appoinment_Progress_Modal({
  show,
  close,
  data,
}: props) {
  //Các step title trong quy trình appoinments
  const stepNames = stepsAppoinment;

  const currentStep = useAppSelector((state) => {
    const savedStep = state.appointments[data.id];
    return savedStep ?? getAppointmentStepFromStatus(data.status);
  });

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return <Appointment_CheckIn data={data} currentStep={currentStep} />;
      case 2:
        return <AssignTechnicianPage data={data} currentStep={currentStep} />;
      case 3:
        return <PaymentDemo handleNext={() => 1} />;
      case 4:
        return <InvoiceDemo />;
    }
  };

  return (
    <ModalStyled open={show} onCancel={close} footer={null}>
      <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <ProgressSteps steps={stepNames} currentStep={currentStep}>
          {renderContent()}
        </ProgressSteps>
      </div>
    </ModalStyled>
  );
}
