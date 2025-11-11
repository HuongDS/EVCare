import { Modal } from "antd";
import {
  getAppointmentStepFromStatus,
  ProgressSteps,
  stepsAppointment,
} from "../../../components/ProgressStep/ProgressStep";
import Appointment_CheckIn from "./Appointment_CheckIn";
import styled from "styled-components";
import Appointment_Assign from "./Appointment_Assign";
import Appointment_Part_Tracking from "./Appointment_Part_Tracking";
import { InvoicePage } from "./Appointment_Invoice";
import WaitingAddingPart from "./WaitingAddingPart";
import { useGetAppointmentById } from "../../../services/appointmentServiceApi";
import { useNotification } from "../../../context/useNotification";
import ColorSpinner from "../StaffComponents/ColorSpinner";
import NextMaintenance from "./NextMaintenance";
import Appointment_Payment from "./Appointment_Payment";
import UnderMaintenance from "./UnderMaintenance";

interface props {
  show: boolean;
  close: () => void;
  appointmentId?: number;
}

export default function Appoinment_Progress_Modal({
  show,
  close,
  appointmentId,
}: props) {
  const notification = useNotification();

  const {
    data: appointmentDetail,
    isLoading,
    error,
  } = useGetAppointmentById(appointmentId ?? 0);

  const stepNames = stepsAppointment;
  const currentStep = getAppointmentStepFromStatus(
    appointmentDetail?.data?.status ?? "Pending"
  );

  if (isLoading) {
    return (
      <ModalStyled open={show} onCancel={close} footer={null}>
        <ModalBodyStyled>
          <ProgressSteps steps={stepNames} currentStep={currentStep || 0}>
            <ModalBodyStyled
              style={{
                height: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ColorSpinner width="6em" height="6em" />
            </ModalBodyStyled>
          </ProgressSteps>
        </ModalBodyStyled>
      </ModalStyled>
    );
  }

  if (!appointmentDetail?.data) {
    notification.error({
      message: "Appointment",
      description: error?.message || "Failed to load appointment details",
      showProgress: true,
    });
    close();
    return null;
  }

  const isNeedMaintenance = appointmentDetail.data.isNeedMantainance;

  const data = appointmentDetail.data;
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <Appointment_CheckIn data={data} close={close} />;
      case 1:
        return <Appointment_Assign data={data} />;
      case 2:
        return <WaitingAddingPart data={data} />;
      case 3:
        if (appointmentDetail.data?.orderStatus === "Processing") {
          return <UnderMaintenance />;
        }
        return <Appointment_Part_Tracking data={data} closeModal={close} />;
      case 4:
        return <Appointment_Payment data={data} />;
      case 5:
        if (isNeedMaintenance) {
          return <NextMaintenance data={data} onSkip={() => 1} />;
        }
        return <InvoicePage data={data} />;
    }
  };

  return (
    <ModalStyled open={show} onCancel={close} footer={null}>
      <ProgressSteps steps={stepNames} currentStep={currentStep || 0}>
        <ModalBodyStyled>{renderContent()}</ModalBodyStyled>
      </ProgressSteps>
    </ModalStyled>
  );
}

const ModalStyled = styled(Modal)`
  display: flex;
  justify-content: center;
  top: 2.5%;
  .ant-modal-content {
    width: 1000px !important;
    max-height: 94vh;
    overflow: hidden;
  }
`;

const ModalBodyStyled = styled.div`
  max-height: 80vh;
  overflow-y: auto;
`;
