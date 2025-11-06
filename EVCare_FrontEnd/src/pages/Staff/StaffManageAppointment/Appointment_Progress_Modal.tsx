import { Modal } from "antd";
import {
  getAppointmentStepFromStatus,
  ProgressSteps,
  stepsAppointment,
} from "../../../components/ProgressStep/ProgressStep";
import Appointment_CheckIn from "./Appointment_CheckIn";
import styled from "styled-components";
import AssignTechnicianPage from "./Appointment_Assign";
import Appointment_Part_Tracking from "./Appointment_Part_Tracking";
import PaymentPage from "./Appointment_Payment";
import { InvoicePage } from "./Appointment_Invoice";
import NextMaintenance from "./NextMaintenance";
import { useEffect, useState } from "react";
import MainteningPage from "./MainteningPage";
import WaitingAddingPart from "./WaitingAddingPart";
import { useGetAppointmentById } from "../../../services/appointmentServiceApi";
import { useNotification } from "../../../context/useNotification";
import ColorSpinner from "../StaffComponents/ColorSpinner";

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

  const [subPage, setSubPage] = useState<
    "payment" | "nextMaintenance" | "maintenance" | null
  >(null);

  useEffect(() => {
    setSubPage(null);
  }, [appointmentDetail?.data?.status]);

  //Các step title trong quy trình appoinments
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
              <ColorSpinner />
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

  const data = appointmentDetail.data;
  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return <Appointment_CheckIn data={data} close={close} />;
      case 1:
        return <AssignTechnicianPage data={data} />;
      case 2:
        return <WaitingAddingPart data={data} />;
      case 3:
        if (subPage === "maintenance") {
          return <MainteningPage />;
        }
        return (
          <Appointment_Part_Tracking
            data={data}
            closeModal={close}
            onConfirmSuccess={() => setSubPage("maintenance")}
          />
        );
      case 4:
        if (subPage === "nextMaintenance") {
          return (
            <NextMaintenance data={data} onSkip={() => setSubPage(null)} />
          );
        }
        return (
          <PaymentPage
            data={data}
            onPaymentSuccess={() => setSubPage("nextMaintenance")}
          />
        );
      case 5:
        if (subPage === "nextMaintenance") {
          return (
            <NextMaintenance data={data} onSkip={() => setSubPage(null)} />
          );
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
