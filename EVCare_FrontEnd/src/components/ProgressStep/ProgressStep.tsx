import { Button, ButtonGroup, Steps } from "@chakra-ui/react";
import type React from "react";

interface Steps {
  title: string;
}

interface StepsProps {
  steps: Steps[];
  children: React.ReactNode;
  // onNext: () => void;
  // onPre: () => void;
}
export const ProgressSteps = ({ steps, children }: StepsProps) => {
  return (
    <Steps.Root defaultStep={1} count={steps.length}>
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

      <ButtonGroup size="sm" variant="outline">
        <Steps.PrevTrigger asChild>
          <Button>Prev</Button>
        </Steps.PrevTrigger>
        <Steps.NextTrigger asChild>
          <Button>Next</Button>
        </Steps.NextTrigger>
      </ButtonGroup>
    </Steps.Root>
  );
};

export const stepsAppoinment = [
  {
    title: "Check In",
  },
  {
    title: "Assign",
  },
  {
    title: "Order",
  },
  {
    title: "Completed",
  },
];
