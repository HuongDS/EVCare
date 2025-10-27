import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { ArrowLeft, Car } from "lucide-react";
import { gsap } from "gsap";

const MAIN_GREEN = "#00AD4E";
const LIGHT_GREEN = "#00C65E";

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fff9 0%, #e8f8ee 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Outfit", sans-serif;
  overflow: hidden;
  text-align: center;
  padding: 40px 20px;
  position: relative;
`;

const NumberWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 60px;
  width: 100%;
  max-width: 800px;
  height: 18rem;
`;

const Half = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: ${MAIN_GREEN};
  font-size: 18rem;
  font-weight: 900;
  letter-spacing: -10px;
  line-height: 0.9;
`;

const TopHalf = styled(Half)`
  clip-path: inset(0 0 49.9% 0);
`;

const BottomHalf = styled(Half)`
  clip-path: inset(50% 0 0 0);
`;

const CarWrapper = styled.div`
  position: fixed; /* tính theo viewport */
  left: 0;
  bottom: 38%;
  opacity: 0;
  pointer-events: none;
  z-index: 50;
`;

const Subtitle = styled.h2`
  color: #1f2937;
  font-size: 2rem;
  margin-bottom: 15px;
`;

const Description = styled.p`
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto 30px auto;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${MAIN_GREEN};
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${LIGHT_GREEN};
    transform: translateY(-2px);
  }
`;

const PageNotFound: React.FC = () => {
  const carRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const car = carRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const wrapper = wrapperRef.current;
    if (!car || !top || !bottom || !wrapper) return;

    const updateAnimation = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const splitZoneStart = wrapperRect.left - 5;
      const splitZoneEnd = wrapperRect.right + 5;
      const screenWidth = window.innerWidth;
      const carWidth = car.offsetWidth;

      gsap.killTweensOf(car);
      gsap.set(car, { x: -carWidth - 150, opacity: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" },
        repeatDelay: 0.6,
      });

      tl.to(car, {
        opacity: 1,
        duration: 0.3,
      })
        .to(car, {
          x: screenWidth + carWidth + 150,
          duration: 5,
          onUpdate: () => {
            const carRect = car.getBoundingClientRect();
            const carFront = carRect.left + carRect.width;
            const carBack = carRect.left;

            if (carFront > splitZoneStart && carBack < splitZoneEnd) {
              gsap.to(top, { y: -25, duration: 0.18, overwrite: "auto" });
              gsap.to(bottom, { y: 35, duration: 0.18, overwrite: "auto" });
            } else {
              gsap.to(top, { y: 0, duration: 0.18, overwrite: "auto" });
              gsap.to(bottom, { y: 0, duration: 0.18, overwrite: "auto" });
            }
          },
        })
        .to(car, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.set(car, { x: -carWidth - 150 });
          },
        });
    };

    updateAnimation();
    window.addEventListener("resize", updateAnimation);
    return () => window.removeEventListener("resize", updateAnimation);
  }, []);

  const handleGoBack = () => window.history.back();

  return (
    <PageContainer>
      <NumberWrapper ref={wrapperRef}>
        <TopHalf ref={topRef}>404</TopHalf>
        <BottomHalf ref={bottomRef}>404</BottomHalf>
      </NumberWrapper>

      <CarWrapper ref={carRef}>
        <Car size={90} color={MAIN_GREEN} />
      </CarWrapper>

      <Subtitle>Page Not Found</Subtitle>
      <Description>
        Oops! Có vẻ bạn đã đi lạc. Hãy quay lại tuyến đường chính của EV Care
        nhé!
      </Description>

      <BackButton onClick={handleGoBack}>
        <ArrowLeft size={20} />
        Go Back
      </BackButton>
    </PageContainer>
  );
};

export default PageNotFound;
