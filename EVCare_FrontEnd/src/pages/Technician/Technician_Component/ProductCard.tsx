import { CardContainer, Info } from "./Style/ProductCard.styled";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import ImageSkeleton from "./ImageSkeleton";

interface ProductCardProps {
  part?: OrderPartsResponseDto;
  onClick?: () => void;
  isSkeleton?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  part,
  onClick,
  isSkeleton = false,
}) => {
  if (isSkeleton) {
    return (
      <CardContainer style={{ opacity: 0.5, pointerEvents: "none" }}>
        <ImageSkeleton alt="loading" height={150} />
        <Info>
          <div style={{ background: "#eee", height: 20, marginBottom: 5 }} />
          <div style={{ background: "#eee", height: 20, marginBottom: 5 }} />
          <div style={{ background: "#eee", height: 20 }} />
        </Info>
      </CardContainer>
    );
  }

  if (!part) return null;

  const isUnavailable = part.isDeleted || part.quantity <= 0;
  const statusText = part.isDeleted
    ? "Parts are no longer available"
    : part.quantity <= 0
    ? "Out of Stock"
    : null;

  return (
    <CardContainer
      onClick={!isUnavailable ? onClick : undefined}
      style={{
        opacity: isUnavailable ? 0.5 : 1,
        cursor: isUnavailable ? "not-allowed" : "pointer",
      }}
    >
      <ImageSkeleton
        src={part.imageUrl || "https://via.placeholder.com/150"}
        alt={part.name}
        height={150}
      />
      <Info>
        <div>{part.name}</div>
        <div>Quantity: {part.quantity}</div>
        <div>{part.price.toLocaleString("vi-VN")} VNĐ</div>
        {statusText && (
          <div style={{ color: "red", fontWeight: "bold" }}>{statusText}</div>
        )}
      </Info>
    </CardContainer>
  );
};

export default ProductCard;
