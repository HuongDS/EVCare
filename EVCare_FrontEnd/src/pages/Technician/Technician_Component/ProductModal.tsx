import { Box, Modal, Button as MuiButton, Fade, Backdrop } from "@mui/material";

import {
  CardContainer,
  Image,
  ProductName,
  Descriptions,
  Info,
} from "./Style/ProductModal.styled";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
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

export default function ProductModal({ open, onClose }: ProductModalProps) {
  const price = 20000;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 400,
        },
      }}
    >
      <Fade in={open} timeout={400}>
        <Box sx={boxStyle}>
          <CardContainer>
            <Image src="https://via.placeholder.com/300x150" alt="Product" />
            <ProductName variant="h6">Product Name</ProductName>

            <Descriptions>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              rhoncus facilisis felis, eget tincidunt tortor pulvinar vitae.
              Donec porta volutpat sem, sed fermentum purus euismod ac.
            </Descriptions>

            <Info>
              <div>Quantity: 30</div>
              <div>{price.toLocaleString("vi-VN")} VNĐ</div>
              <MuiButton variant="contained" color="primary" onClick={onClose}>
                Add To Cart
              </MuiButton>
            </Info>
          </CardContainer>
        </Box>
      </Fade>
    </Modal>
  );
}
