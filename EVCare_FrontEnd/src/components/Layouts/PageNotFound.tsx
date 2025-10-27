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
  position: absolute;
  top: 32%;
  left: 0;
  transform: translateY(-50%);
  opacity: 0;
  pointer-events: none;
  z-index: 50;
`;

const Subtitle = styled.h2`
  color: #1f2937;
  font-size: 2rem;
  margin-top: 3rem;
  position: absolute;
  top: 27.5%;
  left: 0;
  white-space: nowrap;
  transform: translateY(-50%);
  opacity: 0;
`;

const Description = styled.p`
  color: #6b7280;
  max-width: 500px;
  margin-top: 150px;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center;
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
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const car = carRef.current;
    const subtitle = subtitleRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    const wrapper = wrapperRef.current;
    if (!car || !subtitle || !top || !bottom || !wrapper) return;

    const animate = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const splitZoneStart = wrapperRect.left - 5;
      const splitZoneEnd = wrapperRect.right + 5;
      const screenWidth = window.innerWidth;
      const carWidth = car.offsetWidth;
      const textWidth = subtitle.offsetWidth;

      gsap.killTweensOf([car, subtitle]);
      gsap.set([car, subtitle], { opacity: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" },
        repeatDelay: 0.5,
      });

      // Xe và chữ cùng xuất hiện và di chuyển song song
      tl.set(car, { x: -carWidth - 150, opacity: 1 })
        .set(subtitle, { x: -carWidth - textWidth - 170, opacity: 1 }) // chữ nằm sau đít xe
        .to([car, subtitle], {
          x: `+=${screenWidth + carWidth + textWidth + 400}`,
          duration: 6,
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
        .to([car, subtitle], { opacity: 0, duration: 0.3 });
    };

    animate();
    window.addEventListener("resize", animate);
    return () => window.removeEventListener("resize", animate);
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

      <Subtitle ref={subtitleRef}>Page Not Found</Subtitle>

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
