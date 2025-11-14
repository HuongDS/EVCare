import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import TickIcon from "../ThankYou/CheckAnimation";

const MAIN_GREEN = "#00AD4E";
const LIGHT_GREEN = "#7AE582";
const DARK_SHADOW = "rgba(0, 173, 78, 0.4)";

const springEntry = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  80% { transform: scale(1.01); opacity: 1; }
  100% { transform: scale(1); }
`;

const shadowPulse = (color: string) => keyframes`
  0% { box-shadow: 0 0 0 0 ${color}; }
  50% { box-shadow: 0 0 0 8px rgba(0, 173, 78, 0); }
  100% { box-shadow: 0 0 0 0 ${color}; }
`;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #f8fff9 0%, #e8f9f1 100%);
  font-family: "Outfit", sans-serif;
  padding: 20px;
  overflow: hidden;
  animation: ${springEntry} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.27) forwards;
`;

const Message = styled(motion.h2)`
  margin-top: 24px;
  font-size: 3rem;
  font-weight: 700;
  color: ${MAIN_GREEN};
  text-align: center;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
`;

const SubMessage = styled(motion.p)`
  margin-top: 10px;
  font-size: 1.35rem;
  color: #555;
  text-align: center;
  max-width: 80%;
`;

const CountdownText = styled(motion.p)`
  margin-top: 12px;
  font-size: 1.1rem;
  color: #777;
  text-align: center;
  b {
    color: ${MAIN_GREEN};
  }
`;

const MotionButton = styled(motion.button)`
  margin-top: 35px;
  background: ${MAIN_GREEN};
  color: white;
  border: none;
  border-radius: 12px;
  padding: 18px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${DARK_SHADOW};
  animation: ${shadowPulse(DARK_SHADOW)} 2.5s infinite;

  &:hover {
    background: ${LIGHT_GREEN};
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 173, 78, 0.45);
  }
`;

const CompleteVNPay: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const animate = async () => {
      await new Promise((r) => setTimeout(r, 1200));
      await controls.start({
        scale: 0.8,
        y: -30,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      });
      controls.start("showText");
    };
    animate();

    const confettiTimer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(confettiTimer);
  }, [controls]);

  useEffect(() => {
    if (countdown <= 0) navigate("/");
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const textVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    showText: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.7,
      },
    },
  } as const;

  return (
    <PageWrapper>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
          colors={[MAIN_GREEN, LIGHT_GREEN, "#FFFFFF", "#FFD700"]}
        />
      )}

      <motion.div animate={controls}>
        <TickIcon />
      </motion.div>

      <Message variants={textVariants} initial="hidden" animate={controls}>
        VNPay payment successful!
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
        Your transaction has been completed. Thank you very much!
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
        whileTap={{ scale: 0.95 }}
      >
        Back To Home
      </MotionButton>
    </PageWrapper>
  );
};

export default CompleteVNPay;
