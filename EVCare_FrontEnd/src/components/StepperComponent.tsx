import React, { useState, Children, useRef, useLayoutEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import styled from "styled-components";

const MAIN_GREEN = "#00AD4E";
const LIGHT_GREEN = "#00C65E";
const DARK_GRAY = "#222";
const LIGHT_GRAY = "#a3a3a3";

const OuterContainer = styled.div`
  display: flex;
  min-height: 100%;
  flex: 1 1 0%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (min-width: 640px) {
    aspect-ratio: 4 / 3;
  }
  @media (min-width: 768px) {
    aspect-ratio: 2 / 1;
  }
`;

const StepCircleContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 28rem;
  border-radius: 2rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid ${DARK_GRAY};
  background: #fff;
`;

const StepIndicatorRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 2rem;
`;

const StepContentDefault = styled(motion.div)`
  position: relative;
  overflow: hidden;
`;

const StepDefault = styled.div`
  padding: 0 2rem;
`;

const FooterContainer = styled.div`
  padding: 0 2rem 2rem;
`;

const FooterNav = styled.div<{ $isFirst: boolean }>`
  margin-top: 2.5rem;
  display: flex;
  justify-content: ${({ $isFirst }) =>
    $isFirst ? "flex-end" : "space-between"};
`;

const BackButton = styled.button`
  transition: all 350ms;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: ${LIGHT_GRAY};
  cursor: pointer;
  border: none;
  background: none;

  &:hover {
    color: ${MAIN_GREEN};
  }

  &.inactive {
    pointer-events: none;
    opacity: 0.5;
    color: ${LIGHT_GRAY};
  }
`;

const NextButton = styled.button`
  transition: all 350ms;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: ${MAIN_GREEN};
  color: #fff;
  font-weight: 500;
  letter-spacing: -0.025em;
  padding: 0.375rem 0.875rem;
  cursor: pointer;
  border: none;

  &:hover {
    background-color: ${LIGHT_GREEN};
  }

  &:active {
    background-color: ${MAIN_GREEN};
  }
`;

const StepIndicatorWrapper = styled(motion.div)`
  position: relative;
  cursor: pointer;
  outline: none;
`;

const StepIndicatorInner = styled(motion.div)`
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-weight: 600;
`;

const ActiveDot = styled.div`
  height: 0.75rem;
  width: 0.75rem;
  border-radius: 9999px;
  background-color: #fff;
`;

const StepNumber = styled.span`
  font-size: 0.875rem;
`;

const StepConnectorContainer = styled.div`
  position: relative;
  margin: 0 0.5rem;
  height: 0.125rem;
  flex: 1;
  overflow: hidden;
  border-radius: 0.25rem;
  background-color: ${LIGHT_GRAY};
`;

const StepConnectorInner = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
`;

const CheckIconSvg = styled.svg`
  height: 1rem;
  width: 1rem;
  color: #fff;
`;

const stepVariants: Variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: { x: "0%", opacity: 1 },
  exit: (dir: number) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  disableStepIndicators = false,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep: number) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  return (
    <OuterContainer {...rest}>
      <StepCircleContainer>
        <StepIndicatorRow>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  disableStepIndicators={disableStepIndicators}
                  currentStep={currentStep}
                  onClickStep={(clicked) => {
                    setDirection(clicked > currentStep ? 1 : -1);
                    updateStep(clicked);
                  }}
                />
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </StepIndicatorRow>

        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <FooterContainer>
            <FooterNav $isFirst={currentStep === 1}>
              {currentStep !== 1 && (
                <BackButton
                  onClick={() => {
                    setDirection(-1);
                    updateStep(currentStep - 1);
                  }}
                >
                  {backButtonText}
                </BackButton>
              )}
              <NextButton
                onClick={() => {
                  setDirection(1);
                  updateStep(isLastStep ? totalSteps + 1 : currentStep + 1);
                }}
              >
                {isLastStep ? "Complete" : nextButtonText}
              </NextButton>
            </FooterNav>
          </FooterContainer>
        )}
      </StepCircleContainer>
    </OuterContainer>
  );
}

interface StepContentWrapperProps {
  isCompleted: boolean;
  currentStep: number;
  direction: number;
  children: ReactNode;
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
}: StepContentWrapperProps) {
  const [parentHeight, setParentHeight] = useState(0);
  return (
    <StepContentDefault
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={setParentHeight}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </StepContentDefault>
  );
}

interface SlideTransitionProps {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: SlideTransitionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

export function Step({ children }: { children: ReactNode }) {
  return <StepDefault>{children}</StepDefault>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators?: boolean;
}

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  const handleClick = () => {
    if (step !== currentStep && !disableStepIndicators) onClickStep(step);
  };

  return (
    <StepIndicatorWrapper
      onClick={handleClick}
      animate={status}
      initial={false}
    >
      <StepIndicatorInner
        variants={{
          inactive: { backgroundColor: DARK_GRAY, color: LIGHT_GRAY },
          active: { backgroundColor: MAIN_GREEN, color: "#fff" },
          complete: { backgroundColor: LIGHT_GREEN, color: "#fff" },
        }}
        transition={{ duration: 0.3 }}
      >
        {status === "complete" ? (
          <CheckIcon />
        ) : status === "active" ? (
          <ActiveDot />
        ) : (
          <StepNumber>{step}</StepNumber>
        )}
      </StepIndicatorInner>
    </StepIndicatorWrapper>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  const lineVariants: Variants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: MAIN_GREEN },
  };
  return (
    <StepConnectorContainer>
      <StepConnectorInner
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </StepConnectorContainer>
  );
}

function CheckIcon() {
  return (
    <CheckIconSvg
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </CheckIconSvg>
  );
}
