import { useState, useEffect } from "react";
import { Box, Modal, Fade, Backdrop, IconButton } from "@mui/material";
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
} from "./Style/ProductModal.styled";

import ButtonAction from "../../../components/Button/ButtonAction";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  part: OrderPartsResponseDto | null;
  onAddToCart?: (part: OrderPartsResponseDto, quantity: number) => void;
}

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
};

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
        <Box sx={boxStyle}>
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
                <IconButton
                  size="small"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "32px",
                    height: "32px",
                  }}
                >
                  –
                </IconButton>

                <NumberField.Root
                  min={1}
                  max={part?.quantity ?? 1}
                  value={quantity}
                  onValueChange={(value) => handleChange(value)}
                  className="number-field"
                >
                  <NumberField.Input
                    className="quantity-input"
                    style={{
                      width: "60px",
                      textAlign: "center",
                      fontSize: "16px",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                      padding: "4px 0",
                    }}
                  />
                </NumberField.Root>

                <IconButton
                  size="small"
                  onClick={handleIncrease}
                  disabled={quantity >= (part?.quantity ?? 1)}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    width: "32px",
                    height: "32px",
                  }}
                >
                  +
                </IconButton>
              </QuantityControl>
            </Info>
          </CardContainer>
        </Box>
      </Fade>
    </Modal>
  );
}
