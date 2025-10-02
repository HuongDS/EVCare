import { CardContainer, Image, Info } from "./Style/ProductCard.styled";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

interface ProductCardProps {
  part: OrderPartsResponseDto;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ part, onClick }) => {
  return (
    <CardContainer onClick={onClick}>
      <Image src={part.imageUrl || "https://via.placeholder.com/150"} />
      <Info>
        <div>{part.partName}</div>
        <div>Quantity: {part.quantity}</div>
        <div>{part.price.toLocaleString("vi-VN")} VNĐ</div>
      </Info>
    </CardContainer>
  );
};

export default ProductCard;
