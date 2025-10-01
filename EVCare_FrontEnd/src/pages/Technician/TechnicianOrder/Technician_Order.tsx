import { useState } from "react";
import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";

export default function TechnicianOrder() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const openModal = () => {
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => setOpen(false);

  const handleAnimationEnd = () => {
    if (!open) setVisible(false);
  };
  return (
    <div>
      <h1>Technician Order</h1>
      <ProductCard onClick={openModal}></ProductCard>
      {visible && (
        <div>
          <div onClick={closeModal}>Backdrop</div>
          <ProductModal isOpen={open} onAnimationEnd={handleAnimationEnd} />
        </div>
      )}
    </div>
  );
}
