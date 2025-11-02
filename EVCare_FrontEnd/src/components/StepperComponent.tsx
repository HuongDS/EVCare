import React, { useState, Children, useRef, useLayoutEffect } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import styled from "styled-components";

const MAIN_GREEN = "#00AD4E";
const LIGHT_GREEN = "#00C65E";
const DARK_GRAY = "#333";
const LIGHT_GRAY = "#d1d5db";
const TEXT_COLOR = "#222";

/* ----------------- Container & Layout ------------------ */
const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Outfit", sans-serif;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

const StepCircleContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: #fff;
  border: 1px solid ${LIGHT_GRAY};
  border-radius: 16px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin: 0 auto;
`;

/* ----------------- Step Indicators ------------------ */
const StepIndicatorRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  flex-wrap: wrap;
`;

const StepIndicatorWrapper = styled(motion.div)`
  position: relative;
  cursor: pointer;
  outline: none;
`;

const StepIndicatorInner = styled(motion.div)`
  display: flex;
  height: 36px;
  width: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
`;

const StepConnectorContainer = styled.div`
  position: relative;
  margin: 0 10px;
  height: 3px;
  flex: 1;
  border-radius: 5px;
  background-color: ${LIGHT_GRAY};
  overflow: hidden;
`;

const StepConnectorInner = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
`;

/* ----------------- Step Content ------------------ */
const StepContentDefault = styled(motion.div)`
  position: relative;
  overflow: hidden;
  padding: 15px 20px;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
`;

const StepDefault = styled.div`
  color: ${TEXT_COLOR};
  width: 100%;
  box-sizing: border-box;
`;

/* ----------------- Footer Buttons ------------------ */
const FooterContainer = styled.div`
  padding: 15px 0 0;
`;

const FooterNav = styled.div<{ $isFirst: boolean }>`
  display: flex;
  justify-content: ${({ $isFirst }) =>
    $isFirst ? "flex-end" : "space-between"};
  gap: 10px;
`;

const BackButton = styled.button`
  border-radius: 8px;
  padding: 8px 16px;
  color: ${MAIN_GREEN};
  border: 1px solid ${MAIN_GREEN};
  background: white;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: ${MAIN_GREEN};
    color: white;
  }
`;

const NextButton = styled.button`
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 600;
  border: none;
  color: white;
  background: ${MAIN_GREEN};
  cursor: pointer;
  &:hover {
    background: ${LIGHT_GREEN};
  }
  &:disabled {
    background: ${LIGHT_GRAY};
    cursor: not-allowed;
  }
`;

const ActiveDot = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background: white;
`;

const StepNumber = styled.span`
  font-size: 0.875rem;
`;

const CheckIconSvg = styled.svg`
  height: 1rem;
  width: 1rem;
  color: #fff;
`;

const stepVariants: Variants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -100 : 100, opacity: 0 }),
};

/* ----------------- Stepper Logic ------------------ */
interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode[];
  currentStep: number;
  onStepChange: (step: number) => void;
  validateStep?: (stepIndex: number) => boolean;
  onFinalStepCompleted?: () => void;
  backButtonText?: string;
  nextButtonText?: string;
}

export default function Stepper({
  children,
  currentStep,
  onStepChange,
  validateStep,
  onFinalStepCompleted,
  backButtonText = "Back",
  nextButtonText = "Next",
  ...rest
}: StepperProps) {
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep >= totalSteps;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = async () => {
    const valid = validateStep ? validateStep(currentStep) : true;
    if (!valid) return;

    if (isLastStep && onFinalStepCompleted) {
      await onFinalStepCompleted();
    } else {
      setDirection(1);
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      onStepChange(currentStep - 1);
    }
  };

  return (
    <OuterContainer {...rest}>
      <StepCircleContainer>
        {/* Step indicators */}
        <StepIndicatorRow>
          {stepsArray.map((_, index) => {
            const isNotLast = index < totalSteps - 1;
            return (
              <React.Fragment key={index}>
                <StepIndicator
                  step={index + 1}
                  currentStep={currentStep + 1}
                  onClickStep={(stepNum) => {
                    setDirection(stepNum > currentStep + 1 ? 1 : -1);
                    onStepChange(stepNum - 1);
                  }}
                />
                {isNotLast && (
                  <StepConnector isComplete={currentStep + 1 > index + 1} />
                )}
              </React.Fragment>
            );
          })}
        </StepIndicatorRow>

        {/* Step content */}
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
        >
          {stepsArray[currentStep]}
        </StepContentWrapper>

        {/* Navigation buttons */}
        {!isCompleted && (
          <FooterContainer>
            <FooterNav $isFirst={currentStep === 0}>
              {currentStep !== 0 && (
                <BackButton onClick={handleBack}>{backButtonText}</BackButton>
              )}
              <NextButton onClick={handleNext}>
                {isLastStep ? "Finish" : nextButtonText}
              </NextButton>
            </FooterNav>
          </FooterContainer>
        )}
      </StepCircleContainer>
    </OuterContainer>
  );
}

/* ----------------- Step Transitions ------------------ */
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

/* ----------------- Step Indicator ------------------ */
export function Step({ children }: { children: ReactNode }) {
  return <StepDefault>{children}</StepDefault>;
}

interface StepIndicatorProps {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
}

function StepIndicator({ step, currentStep, onClickStep }: StepIndicatorProps) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  const handleClick = () => {
    if (step !== currentStep) onClickStep(step);
  };

  return (
    <StepIndicatorWrapper
      onClick={handleClick}
      animate={status}
      initial={false}
    >
      <StepIndicatorInner
        variants={{
          inactive: { backgroundColor: LIGHT_GRAY, color: DARK_GRAY },
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

/* ----------------- Step Connector & Check Icon ------------------ */
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
