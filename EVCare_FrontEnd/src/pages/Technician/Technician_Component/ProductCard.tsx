import styled from "styled-components";

// Định nghĩa kiểu cho props của ProductCard
interface ProductCardProps {
  onClick: () => void;
}

const CardContainer = styled.button`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  width: 190px;
  height: 254px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid white;
  box-shadow: 12px 17px 51px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(2%);
  border-radius: 17px;
  text-align: center;
  cursor: pointer;
  transition: all 0.5s;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-weight: bolder;
  color: black;

  &:hover {
    border: 1px solid black;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95) rotateZ(1.7deg);
  }
`;

const Image = styled.div`
  width: 80%;
  height: 100px;
  background-color: #f3f3f3;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProductCard: React.FC<ProductCardProps> = ({ onClick }) => {
  const price = 20000;
  return (
    <CardContainer onClick={onClick}>
      <Image>Product Image</Image>
      <Info>
        <div>Product Name</div>
        <div>Quantity: 30</div>
        <div>{price.toLocaleString("vi-VN")} VNĐ</div>
      </Info>
    </CardContainer>
  );
};

export default ProductCard;
