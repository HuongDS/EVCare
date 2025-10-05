import { Modal } from "antd";
import {
  ProgressSteps,
  stepsAppoinment,
} from "../../../components/ProgressStep/ProgressStep";
import Appointment_CheckIn from "./Appointment_CheckIn";
import styled from "styled-components";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";

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
  const steps = stepsAppoinment;
  return (
    <ModalStyled open={show} onCancel={close} footer={null}>
      <ProgressSteps
        steps={steps}
        children={<Appointment_CheckIn data={data} />}
      />
    </ModalStyled>
  );
}
