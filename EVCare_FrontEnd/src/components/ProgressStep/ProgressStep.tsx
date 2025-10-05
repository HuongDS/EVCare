import { Steps } from "@chakra-ui/react";
import type React from "react";

interface Steps {
  title: string;
}

interface StepsProps {
  steps: Steps[];
  currentStep: number;
  children: React.ReactNode;
}
export const ProgressSteps = ({ steps, currentStep, children }: StepsProps) => {
  return (
    <Steps.Root step={currentStep} count={steps.length}>
      <Steps.List style={{ padding: "20px" }}>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator style={{ fontSize: "2px" }} />
            <Steps.Title>{step.title}</Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {children}
    </Steps.Root>
  );
};

//Title của Appoinment Steps:
export const stepsAppoinment = [
  {
    title: "Check In",
  },
  {
    title: "Assign",
  },
  {
    title: "Payment",
  },
  {
    title: "Completed",
  },
];

//Thay đổi Step theo Appointment Status
export const getAppointmentStepFromStatus = (status: string) => {
  switch (status) {
    case "Confirmed":
      return 1;
    case "CheckedIn":
      return 2;
    case "InProgress":
      return 3;
    case "ReadyForPickup":
      return 3;
    case "Done":
      return 4;
  }
};
