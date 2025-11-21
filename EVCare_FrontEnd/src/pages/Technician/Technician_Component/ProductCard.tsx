import {
  CardContainer,
  Image,
  Info,
  Title,
  Description,
} from "./Style/ProductCard.styled";
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
      <CardContainer style={{ opacity: 0.6, pointerEvents: "none" }}>
        <ImageSkeleton alt="loading" height={200} />
        <Info>
          <div
            style={{
              background: "#eee",
              height: 20,
              margin: "8px 0",
              borderRadius: 4,
            }}
          />
          <div
            style={{
              background: "#eee",
              height: 16,
              width: "70%",
              margin: "6px auto",
              borderRadius: 4,
            }}
          />
        </Info>
      </CardContainer>
    );
  }

  if (!part) return null;

  const isUnavailable = part.isDeleted || part.quantity <= 0;
  const statusText = part.isDeleted
    ? "Discontinued"
    : part.quantity <= 0
    ? "Out of Stock"
    : null;

  return (
    <CardContainer
      onClick={!isUnavailable ? onClick : undefined}
      style={{
        opacity: isUnavailable ? 0.6 : 1,
        cursor: isUnavailable ? "not-allowed" : "pointer",
        position: "relative",
      }}
    >
      <Image
        src={
          part.imageUrl || "https://via.placeholder.com/250x200?text=No+Image"
        }
        alt={part.name}
      />

      {statusText && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: isUnavailable ? "#ff5252" : "#00ad4e",
            color: "#fff",
            fontSize: "0.8rem",
            padding: "4px 8px",
            borderRadius: "6px",
            fontWeight: 600,
          }}
        >
          {statusText}
        </div>
      )}

      <Info>
        <Title>{part.name}</Title>
        <Description>Quantity: {part.quantity}</Description>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            color: "#00ad4e",
            marginTop: "6px",
          }}
        >
          {part.price.toLocaleString("vi-VN")} VNĐ
        </div>
      </Info>
    </CardContainer>
  );
};

export default ProductCard;
