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
import PaymentDemo from "./Appointment_Order";
import InvoiceDemo from "./Appointment_Invoice";
import Appointment_Part_Tracking from "./Appointment_Part_Tracking";

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
        return <Appointment_Part_Tracking />;
      case 3:
        return <PaymentDemo data={data} currentStep={currentStep} />;
      case 5:
        return <InvoiceDemo />;
    }
  };

  return (
    <ModalStyled open={show} onCancel={close} footer={null}>
      <ProgressSteps steps={stepNames} currentStep={currentStep}>
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {renderContent()}
        </div>
      </ProgressSteps>
    </ModalStyled>
  );
}
