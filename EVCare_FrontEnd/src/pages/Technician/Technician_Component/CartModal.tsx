import {
  Box,
  Modal,
  Fade,
  Backdrop,
  Button as MuiButton,
  IconButton,
} from "@mui/material";
import {
  CartItem,
  ItemDetails,
  ItemLeft,
  ItemRight,
  QuantityControl,
  QuantityNumber,
  EmptyCartMessage,
  PriceTag,
} from "./Style/CartModal.styled";

import DeleteIcon from "@mui/icons-material/Delete";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: { part: OrderPartsResponseDto; quantity: number }[];
  onQuantityChange: (partId: number, newQty: number) => void;
  onRemove: (partId: number) => void;
  onSend: () => void;
}

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh",
  overflowY: "auto",
};

export default function CartModal({
  open,
  onClose,
  cart,
  onQuantityChange,
  onRemove,
  onSend,
}: CartModalProps) {
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
          <h2>🛒 Cart ({cart.length})</h2>

          {cart.length === 0 && (
            <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
          )}

          {cart.map(({ part, quantity }) => (
            <CartItem key={part.id}>
              {/* Bên trái: tên và giá */}
              <ItemLeft>
                <ItemDetails>{part.name}</ItemDetails>
                <PriceTag>
                  {(part.price ?? 0).toLocaleString("vi-VN")} VNĐ
                </PriceTag>
              </ItemLeft>

              {/* Bên phải: bộ chỉnh số lượng + nút xoá */}
              <ItemRight>
                <QuantityControl>
                  <IconButton
                    size="small"
                    onClick={() =>
                      onQuantityChange(part.id, Math.max(1, quantity - 1))
                    }
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

                  <QuantityNumber>{quantity}</QuantityNumber>

                  <IconButton
                    size="small"
                    onClick={() =>
                      onQuantityChange(
                        part.id,
                        Math.min(quantity + 1, part.quantity ?? quantity + 1)
                      )
                    }
                    disabled={quantity >= (part.quantity ?? 1)}
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

          {cart.length > 0 && (
            <MuiButton
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 3 }}
              onClick={onSend}
            >
              Send Cart
            </MuiButton>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
