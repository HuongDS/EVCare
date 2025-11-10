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
  EmptyCartMessage,
} from "./Style/CartModal.styled";
import DeleteIcon from "@mui/icons-material/Delete";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";
import {
  DamageLevelEnum,
  DamageLevelLabels,
  damageColorMap,
} from "../../../models/enums/DamageLevelEnum";
import ButtonAction from "../../../components/Button/ButtonAction";

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
  width: "92%",
  maxWidth: 950,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: "0 12px 32px rgba(0, 173, 78, 0.25)",
  p: 3,
  maxHeight: "88vh",
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
            <CartList>
              {cart.length === 0 ? (
                <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
              ) : (
                cart.map(({ part, quantity }) => (
                  <CartItem key={part.id}>
                    <ItemLeft>
                      <ItemDetails>{part.name}</ItemDetails>
                      <PriceTag>
                        {(part.price ?? 0).toLocaleString("vi-VN")} VNĐ
                      </PriceTag>
                    </ItemLeft>
                    <ItemRight>
                      <QuantityControl>
                        <IconButton
                          size="small"
                          onClick={() =>
                            onQuantityChange(part.id, Math.max(1, quantity - 1))
                          }
                          disabled={quantity <= 1}
                          sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "30px",
                            height: "30px",
                            color: "#00ad4e",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "#00ad4e20",
                            },
                          }}
                        >
                          –
                        </IconButton>
                        <QuantityNumber>{quantity}</QuantityNumber>
                        <IconButton
                          size="small"
                          onClick={() =>
                            onQuantityChange(part.id, quantity + 1)
                          }
                          sx={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "30px",
                            height: "30px",
                            color: "#00ad4e",
                            transition: "0.3s",
                            "&:hover": {
                              backgroundColor: "#00ad4e20",
                            },
                          }}
                        >
                          +
                        </IconButton>
                        <select
                          value={damageLevels[part.id]}
                          onChange={(e) =>
                            setDamageLevels((prev) => ({
                              ...prev,
                              [part.id]: Number(e.target.value),
                            }))
                          }
                          style={{
                            marginLeft: "10px",
                            fontSize: "12px",
                            padding: "4px 6px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            backgroundColor:
                              damageColorMap[damageLevels[part.id]],
                            color: "#fff",
                            fontWeight: 600,
                            cursor: "pointer",
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
                      <IconButton
                        color="error"
                        onClick={() => onRemove(part.id)}
                        sx={{
                          ml: 1,
                          backgroundColor: "#fff",
                          "&:hover": { backgroundColor: "#ffebee" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ItemRight>
                  </CartItem>
                ))
              )}
            </CartList>

            <CheckoutBox>
              <CheckoutHeader>Checkout Summary</CheckoutHeader>
              <TotalSection>
                <h4>Items</h4>
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
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ButtonAction
                  text={loading ? "Sending..." : "Send"}
                  color="white"
                  backgroundColor={loading ? "#ccc" : "#00ad4e"}
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
