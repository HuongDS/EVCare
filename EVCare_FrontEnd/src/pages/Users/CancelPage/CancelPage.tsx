import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import CancelIcon from "./CancelIcon";

const MAIN_RED = "#FF4D4F";
const LIGHT_RED = "#FFA39E";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #fff9f9 0%, #ffeaea 100%);
  font-family: "Outfit", sans-serif;
  padding: 20px;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease;
`;

const Message = styled(motion.h2)`
  margin-top: 24px;
  font-size: 2.75rem;
  font-weight: 600;
  color: ${MAIN_RED};
  text-align: center;
`;

const SubMessage = styled(motion.p)`
  margin-top: 10px;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
`;

const CountdownText = styled(motion.p)`
  margin-top: 8px;
  font-size: 1rem;
  color: #777;
  text-align: center;
`;

const MotionButton = styled(motion.button)`
  margin-top: 28px;
  background: ${MAIN_RED};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 77, 79, 0.25);

  &:hover {
    background: ${LIGHT_RED};
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(255, 77, 79, 0.35);
  }
`;

const CancelPage: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(25);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const animate = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      await controls.start({
        scale: 0.9,
        y: -20,
        transition: { duration: 0.8, ease: "easeInOut" },
      });
      controls.start("showText");
    };
    animate();

    const confettiTimer = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(confettiTimer);
  }, [controls]);

  useEffect(() => {
    if (countdown <= 0) navigate("/");
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    showText: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  } as const;

  return (
    <PageWrapper>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={100}
          colors={[MAIN_RED, LIGHT_RED, "#FFFFFF"]}
        />
      )}

      <motion.div animate={controls}>
        <CancelIcon />
      </motion.div>

      <Message variants={textVariants} initial="hidden" animate={controls}>
        Your booking has been cancelled.
      </Message>

      <SubMessage
        variants={{
          ...textVariants,
          showText: {
            ...textVariants.showText,
            transition: { ...textVariants.showText.transition, delay: 0.3 },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        We’re sorry to see you go.
      </SubMessage>

      <CountdownText
        variants={{
          ...textVariants,
          showText: {
            ...textVariants.showText,
            transition: {
              ...textVariants.showText.transition,
              delay: 0.45,
            },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        Redirecting to homepage in <b>{countdown}</b> seconds...
      </CountdownText>

      <MotionButton
        onClick={() => navigate("/")}
        variants={{
          ...textVariants,
          showText: {
            ...textVariants.showText,
            transition: {
              ...textVariants.showText.transition,
              delay: 0.6,
            },
          },
        }}
        initial="hidden"
        animate={controls}
      >
        Back to Homepage
      </MotionButton>
    </PageWrapper>
  );
};

export default CancelPage;
