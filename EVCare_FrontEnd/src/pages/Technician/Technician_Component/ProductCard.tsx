//Product Card
import { CardContainer, Info } from "./Style/ProductCard.styled";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import ImageSkeleton from "./ImageSkeleton";

interface ProductCardProps {
  part: OrderPartsResponseDto;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ part, onClick }) => {
  return (
    <CardContainer onClick={onClick}>
      <ImageSkeleton
        src={part.imageUrl || "https://via.placeholder.com/150"}
        alt={part.name}
        height={150}
      />

      <Info>
        <div>{part.name}</div>
        <div>Quantity: {part.quantity}</div>
        <div>{part.price.toLocaleString("vi-VN")} VNĐ</div>
      </Info>
    </CardContainer>
  );
};

export default ProductCard;
