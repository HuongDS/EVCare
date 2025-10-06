import {
  Box,
  Modal,
  Fade,
  Backdrop,
  Button as MuiButton,
  IconButton,
} from "@mui/material";
import { CartItem, ItemInfo } from "./Style/CartModal.styled";
import DeleteIcon from "@mui/icons-material/Delete";

import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

interface CartModalProps {
  open: boolean;
  onClose: () => void;
  cart: { part: OrderPartsResponseDto; quantity: number }[];
  onRemove: (partId: number) => void;
  onSend: () => void;
}

const boxStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
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
          <h2>Cart ({cart.length})</h2>

          {cart.length === 0 && <p>Your cart is empty</p>}

          {cart.map(({ part, quantity }) => (
            <CartItem key={part.id}>
              <ItemInfo>
                <span>{part.name}</span>
                <span>Quantity: {quantity}</span>
                <span>
                  Price: {(part.price ?? 0).toLocaleString("vi-VN")} VNĐ
                </span>
              </ItemInfo>
              <IconButton color="error" onClick={() => onRemove(part.id)}>
                <DeleteIcon />
              </IconButton>
            </CartItem>
          ))}

          {cart.length > 0 && (
            <MuiButton
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
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
