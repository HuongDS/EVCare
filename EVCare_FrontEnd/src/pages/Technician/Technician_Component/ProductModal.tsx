import { useState, useEffect } from "react";
import { Modal, Fade, Backdrop } from "@mui/material";
import { NumberField } from "@base-ui-components/react/number-field";
import ImageSkeleton from "./ImageSkeleton";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

import {
  CardContainer,
  ProductName,
  Info,
  TopRow,
  PriceQuantity,
  QuantityControl,
  StyledBox,
  StyledIconButton,
  QuantityInput,
} from "./Style/ProductModal.styled";

import ButtonAction from "../../../components/Button/ButtonAction";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  part: OrderPartsResponseDto | null;
  onAddToCart?: (part: OrderPartsResponseDto, quantity: number) => void;
}

export default function ProductModal({
  open,
  onClose,
  part,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) setQuantity(1);
  }, [open]);

  const handleIncrease = () => {
    if (quantity < (part?.quantity ?? 1)) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleChange = (value: number | null) => {
    if (!part) return;
    const safeValue = value ?? 1;
    if (safeValue < 1) setQuantity(1);
    else if (safeValue > part.quantity) setQuantity(part.quantity);
    else setQuantity(safeValue);
  };

  const handleAdd = () => {
    if (part) {
      onAddToCart?.(part, quantity);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 400 } }}
    >
      <Fade in={open} timeout={400}>
        <StyledBox>
          <CardContainer>
            <ImageSkeleton
              src={
                part?.imageUrl ||
                "https://placehold.co/300x180/png?text=No+Image"
              }
              alt={part?.name || "Product"}
              height={180}
            />

            <ProductName variant="h6">
              {part?.name || "Product Name"}
            </ProductName>

            <Info>
              <TopRow>
                <PriceQuantity>
                  <span>{(part?.price ?? 0).toLocaleString("vi-VN")} VNĐ</span>
                  <span>Stock: {part?.quantity ?? 0}</span>
                </PriceQuantity>

                <ButtonAction
                  text="Add To Cart"
                  color="white"
                  backgroundColor={part ? "#00AD4E" : "#ccc"}
                  action={handleAdd}
                />
              </TopRow>

              <QuantityControl>
                <StyledIconButton
                  size="small"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                >
                  –
                </StyledIconButton>

                <NumberField.Root
                  min={1}
                  max={part?.quantity ?? 1}
                  value={quantity}
                  onValueChange={(value) => handleChange(value)}
                  className="number-field"
                >
                  <QuantityInput as={NumberField.Input} />
                </NumberField.Root>

                <StyledIconButton
                  size="small"
                  onClick={handleIncrease}
                  disabled={quantity >= (part?.quantity ?? 1)}
                >
                  +
                </StyledIconButton>
              </QuantityControl>
            </Info>
          </CardContainer>
        </StyledBox>
      </Fade>
    </Modal>
  );
}
