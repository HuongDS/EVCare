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
      <Steps.List style={{ margin: "2%" }}>
        {steps.map((step, index) => (
          <Steps.Item key={index} index={index} title={step.title}>
            <Steps.Indicator boxSize={8} />
            <Steps.Title
              style={{ fontSize: "15px", fontFamily: "'Outfit', sans-serif" }}
            >
              {step.title}
            </Steps.Title>
            <Steps.Separator />
          </Steps.Item>
        ))}
      </Steps.List>
      {children}
    </Steps.Root>
  );
};

//Title của Appoinment Steps:
export const stepsAppointment = [
  {
    title: "Check In",
  },
  {
    title: "Assign",
  },
  {
    title: "Orders",
  },
  {
    title: "Processing",
  },
  {
    title: "Completed",
  },
];

//Thay đổi Step theo Appointment Status
export const getAppointmentStepFromStatus = (status: string) => {
  switch (status) {
    case "Confirmed":
      return 0;
    case "CheckedIn":
      return 1;
    case "AddingPart":
      return 2;
    case "InProgress":
      return 3;
    case "ReadyForPickup":
      return 4;
    case "Done":
      return 5;
  }
};
