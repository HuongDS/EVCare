import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import type { CardData } from "../../../../models/Pics/CardData";

export const Card = ({
  id,
  url,
  moveCardToEnd,
  cards,
}: {
  id: number;
  url: string;
  moveCardToEnd: (cardId: number) => void;
  cards: CardData[];
}) => {
  const x = useMotionValue(0);

  const rotateRaw = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const rotate = useTransform(() => {
    const offset = isFront ? 0 : id % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      moveCardToEnd(id);
    }
  };

  useEffect(() => {
    if (!isFront) {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 25 });
    }
  }, [isFront, x]);

  return (
    <motion.img
      src={url}
      alt="Placeholder alt"
      className="h-96 w-72 origin-bottom rounded-lg bg-white object-cover shadow-lg hover:cursor-grab active:cursor-grabbing"
      style={{
        gridRow: 1,
        gridColumn: 1,
        position: "absolute",
        x,
        opacity: isFront ? opacity : 1,
        rotate,
        transition: "0.2s transform, 0.2s scale",
        boxShadow: isFront ? "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)" : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98 - (cards.length - 1 - cards.findIndex((c) => c.id === id)) * 0.02,
        y: isFront ? 0 : -20, // Hơi nâng thẻ trên cùng lên
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    />
  );
};
