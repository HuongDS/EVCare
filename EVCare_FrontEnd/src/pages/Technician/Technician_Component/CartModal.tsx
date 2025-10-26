import { useEffect, useState } from "react";
import { Box, Modal, Fade, Backdrop, IconButton } from "@mui/material";
import {
  CartContainer,
  CartList,
  CheckoutBox,
  CartItem,
  ItemDetails,
  ItemLeft,
  ItemRight,
  QuantityControl,
  QuantityNumber,
  PriceTag,
  TotalSection,
  TotalLine,
  TotalValue,
  CheckoutHeader,
  ProductLine,
  Title,
} from "./Style/CartModal.styled";

import DeleteIcon from "@mui/icons-material/Delete";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import {
  DamageLevelEnum,
  DamageLevelLabels,
  damageColorMap,
} from "../../../models/enums/DamageLevelEnum";
import ButtonAction from "../../../components/Button/ReviewButton";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: { part: OrderPartsResponseDto; quantity: number }[];
  onQuantityChange: (partId: number, newQty: number) => void;
  onRemove: (partId: number) => void;
  onSend: (damageLevels: Record<number, DamageLevelEnum>) => void;
  loading: boolean;
}

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 900,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 3,
  maxHeight: "85vh",
  overflowY: "auto",
};

export default function CartModal({
  open,
  onClose,
  cart,
  onQuantityChange,
  onRemove,
  onSend,
  loading,
}: CartModalProps) {
  const [damageLevels, setDamageLevels] = useState<
    Record<number, DamageLevelEnum>
  >({});

  // Initialize damageLevels when cart changes
  useEffect(() => {
    const initLevels: Record<number, DamageLevelEnum> = {};
    cart.forEach(({ part }) => {
      initLevels[part.id] =
        damageLevels[part.id] ?? DamageLevelEnum.NotAssessed;
    });
    setDamageLevels(initLevels);
  }, [cart]);

  const total = cart.reduce(
    (sum, item) => sum + (item.part.price ?? 0) * item.quantity,
    0
  );

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
          <Title>Part's Cart ({cart.length})</Title>
          <CartContainer>
            {/* Left side: cart list */}
            <CartList>
              {cart.map(({ part, quantity }) => (
                <CartItem key={part.id}>
                  <ItemLeft>
                    <ItemDetails>{part.name}</ItemDetails>
                    <PriceTag>
                      {(part.price ?? 0).toLocaleString("vi-VN")} VNĐ
                    </PriceTag>
                  </ItemLeft>

                  <ItemRight>
                    <QuantityControl>
                      {/* Button giảm */}
                      <IconButton
                        size="small"
                        onClick={() =>
                          onQuantityChange(part.id, Math.max(1, quantity - 1))
                        }
                        disabled={quantity <= 1}
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "28px",
                          height: "28px",
                        }}
                      >
                        –
                      </IconButton>

                      <QuantityNumber>{quantity}</QuantityNumber>

                      {/* Button tăng */}
                      <IconButton
                        size="small"
                        onClick={() => onQuantityChange(part.id, quantity + 1)}
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          width: "28px",
                          height: "28px",
                        }}
                      >
                        +
                      </IconButton>

                      {/* Damage dropdown */}
                      <select
                        value={damageLevels[part.id]}
                        onChange={(e) =>
                          setDamageLevels((prev) => ({
                            ...prev,
                            [part.id]: Number(e.target.value),
                          }))
                        }
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          padding: "2px 4px",
                          borderRadius: "6px",
                          border: "1px solid #ccc",
                          backgroundColor:
                            damageColorMap[damageLevels[part.id]],
                          color: "white",
                          fontWeight: 600,
                        }}
                      >
                        {Object.entries(DamageLevelLabels).map(
                          ([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          )
                        )}
                      </select>
                    </QuantityControl>

                    {/* Remove */}
                    <IconButton
                      color="error"
                      onClick={() => onRemove(part.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ItemRight>
                </CartItem>
              ))}
            </CartList>

            {/* Right side: checkout */}
            <CheckoutBox>
              <CheckoutHeader>Check Out</CheckoutHeader>
              <TotalSection>
                <h4>Total Product</h4>
                {cart.map(({ part, quantity }) => (
                  <ProductLine key={part.id}>
                    <span>{part.name}</span>
                    <span>
                      {(part.price ?? 0).toLocaleString("vi-VN")} × {quantity}
                    </span>
                  </ProductLine>
                ))}
              </TotalSection>

              <TotalLine>
                <strong>Total</strong>
                <TotalValue>{total.toLocaleString("vi-VN")} VNĐ</TotalValue>
              </TotalLine>

              <div
                style={{
                  opacity: loading ? 0.6 : 1,
                  pointerEvents: loading ? "none" : "auto",
                }}
              >
                <ButtonAction
                  text={loading ? "Sending..." : "Send"}
                  color="white"
                  backgroundColor={loading ? "#999" : "#00AD4E"}
                  action={() => onSend(damageLevels)}
                />
              </div>
            </CheckoutBox>
          </CartContainer>
        </Box>
      </Fade>
    </Modal>
  );
}
