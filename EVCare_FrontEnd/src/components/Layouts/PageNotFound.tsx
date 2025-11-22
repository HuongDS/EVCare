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
  margin-bottom: 80px;
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
  clip-path: inset(0 0 49.5% 0);
`;

const BottomHalf = styled(Half)`
  clip-path: inset(50% 0 0 0);
`;

const AnimatedContentWrapper = styled.div`
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  white-space: nowrap;
  pointer-events: none;
  z-index: 60;
  opacity: 0;
`;

const CarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  opacity: 1;
`;

const Subtitle = styled.h2`
  color: #16a34a;
  font-size: 2rem;
  margin: 0;
  opacity: 1;
`;

const Description = styled.p`
  color: #374151;
  max-width: 540px;
  line-height: 1.7;
  font-size: 2rem;
  text-align: center;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${MAIN_GREEN};
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  margin-top: 2rem;

  &:hover {
    background: ${LIGHT_GREEN};
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 198, 94, 0.25);
  }
`;

const PageNotFound: React.FC = () => {
  const carRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animatedContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    const wrapper = wrapperRef.current;
    const animatedContent = animatedContentRef.current;
    if (!top || !bottom || !wrapper || !animatedContent) return;

    const animate = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const splitZoneStart = wrapperRect.left - 5;
      const splitZoneEnd = wrapperRect.right + 5;
      const screenWidth = window.innerWidth;
      const contentWidth = animatedContent.offsetWidth;
      gsap.killTweensOf(animatedContent);
      gsap.set(animatedContent, { opacity: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" },
        repeatDelay: 0.5,
      });

      tl.set(animatedContent, { x: -screenWidth - contentWidth, opacity: 1 })

        .to(animatedContent, {
          x: `+=${2 * screenWidth + contentWidth}`,
          duration: 8,
          onUpdate: () => {
            const contentRect = animatedContent.getBoundingClientRect();
            const contentFront = contentRect.left + contentRect.width;
            const contentBack = contentRect.left;

            if (contentFront > splitZoneStart && contentBack < splitZoneEnd) {
              gsap.to(top, { y: -25, duration: 0.18, overwrite: "auto" });
              gsap.to(bottom, { y: 35, duration: 0.18, overwrite: "auto" });
            } else {
              gsap.to(top, { y: 0, duration: 0.18, overwrite: "auto" });
              gsap.to(bottom, { y: 0, duration: 0.18, overwrite: "auto" });
            }
          },
        })

        .to(animatedContent, { opacity: 0, duration: 0.3 });
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
        <AnimatedContentWrapper ref={animatedContentRef}>
          <Subtitle ref={subtitleRef}>Page Not Found</Subtitle>
          <CarWrapper ref={carRef}>
            <Car size={90} color={MAIN_GREEN} />
          </CarWrapper>
        </AnimatedContentWrapper>
      </NumberWrapper>

      <Description>
        Oops! Looks like this road doesn’t exist. Let’s get you back on track to the main route.
      </Description>

      <BackButton onClick={handleGoBack}>
        <ArrowLeft size={20} />
        Go Back
      </BackButton>
    </PageContainer>
  );
};

export default PageNotFound;
