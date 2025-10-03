import { useEffect, useState } from "react";
import ProductCard from "../Technician_Component/ProductCard";
import ProductModal from "../Technician_Component/ProductModal";
import { getAllParts } from "../../../services/partApi";
import type { OrderPartsResponseDto } from "../../../models/OrderPartModel/Order_Parts_Model";

export default function TechnicianOrder() {
  const [open, setOpen] = useState(false);
  const [parts, setParts] = useState<OrderPartsResponseDto[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await getAllParts();
        setParts(res?.data ?? []);
      } catch (error) {
        console.error("Error fetching parts:", error);
        setParts([]);
      }
    };
    fetchParts();
  }, []);

  return (
    <div>
      <h1>Technician Order</h1>

      {parts.map((part) => (
        <ProductCard
          key={part.partId}
          part={part}
          onClick={() => setOpen(true)}
        />
      ))}

      <ProductModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
