import styled from "styled-components";

const CardContainer = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  width: 300px;
  height: auto;
  background: rgba(255, 255, 255, 1);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
`;

const Image = styled.div`
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 10px;
  margin-bottom: 15px;
`;

const Content = styled.div``;

const ProductName = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Descriptions = styled.div`
  font-size: 1em;
  color: #555;
  margin-bottom: 15px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ProductModal = ({
  isOpen,
  onAnimationEnd,
}: {
  isOpen: boolean;
  onAnimationEnd: () => void;
}) => {
  const price = 20000;
  return (
    <CardContainer
      style={{ display: isOpen ? "block" : "none" }}
      onAnimationEnd={onAnimationEnd}
    >
      <Image />
      <Content>
        <ProductName>Tên sản phẩm</ProductName>
        <Descriptions>Đây là mô tả sản phẩm.</Descriptions>
        <Info>
          <div>Số lượng: 30</div>
          <div>{price.toLocaleString("vi-VN")} VNĐ</div>
          <Button>Thêm vào giỏ</Button>
        </Info>
      </Content>
    </CardContainer>
  );
};

export default ProductModal;
