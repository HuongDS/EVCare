import styled from "styled-components";

const CardContainer = styled.div``;
const Image = styled.div``;
const Content = styled.div``;
const ProductName = styled.div``;
const Descriptions = styled.div``;
const Info = styled.div``;
const Button = styled.button``;

const ProductModal = () => {
  const price = 20000;
  return (
    <CardContainer>
      <Image />
      <Content>
        <ProductName></ProductName>
        <Descriptions></Descriptions>
        <Info>
          <div>Quantity: 30</div>
          <div>{price.toLocaleString("vi-VN")} VNĐ</div>
          <Button>Add To Cart</Button>
        </Info>
      </Content>
    </CardContainer>
  );
};

export default ProductModal;
