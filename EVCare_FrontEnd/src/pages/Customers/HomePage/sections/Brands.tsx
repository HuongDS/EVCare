import styled, { keyframes } from "styled-components";
import vinfastlogo from "../../../../assets/Vinfast.png";
import teslalogo from "../../../../assets/Tesla.png";
import bydLogo from "../../../../assets/byd.png";

const scroll = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const SliderWrapper = styled.div`
  overflow: hidden;
  background: #f5f5f5;
  padding: 20px 0;
`;

const SlideTrack = styled.div`
  display: flex;
  gap: 70px;
  width: calc(200px * 6 * 2);
  animation: ${scroll} 10s linear infinite;
`;

const Slide = styled.div`
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 40px;
    object-fit: contain;
    filter: grayscale(30%);
    transition: filter 0.3s ease;

    &:hover {
      filter: grayscale(0%);
    }
  }
`;

const Brands = () => (
  <SliderWrapper>
    <SlideTrack>
      <Slide>
        <img src={vinfastlogo} alt="Vinfast" />
      </Slide>
      <Slide>
        <img src={teslalogo} alt="Tesla" />
      </Slide>
      <Slide>
        <img src={bydLogo} alt="BYD" />
      </Slide>

      {/* Lặp lại để tạo vòng lặp */}
      <Slide>
        <img src={vinfastlogo} alt="Vinfast" />
      </Slide>
      <Slide>
        <img src={teslalogo} alt="Tesla" />
      </Slide>
      <Slide>
        <img src={bydLogo} alt="BYD" />
      </Slide>

      {/* Nhân đôi toàn bộ logo */}
      <Slide>
        <img src={vinfastlogo} alt="Vinfast" />
      </Slide>
      <Slide>
        <img src={teslalogo} alt="Tesla" />
      </Slide>
      <Slide>
        <img src={bydLogo} alt="BYD" />
      </Slide>

      <Slide>
        <img src={vinfastlogo} alt="Vinfast" />
      </Slide>
      <Slide>
        <img src={teslalogo} alt="Tesla" />
      </Slide>
      <Slide>
        <img src={bydLogo} alt="BYD" />
      </Slide>
    </SlideTrack>
  </SliderWrapper>
);

export default Brands;
