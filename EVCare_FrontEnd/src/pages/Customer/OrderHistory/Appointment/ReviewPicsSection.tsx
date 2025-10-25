import { useEffect, useState } from "react";
import { Card } from "./PicCard";
import type { CardData } from "../../../../models/Pics/CardData";

interface Props {
  data: CardData[];
}

const ReviewPicsSection = ({ data }: Props) => {
  const [cards, setCards] = useState<CardData[]>(data);

  const moveCardToEnd = (cardId: number) => {
    setCards((prevCards) => {
      const cardIndex = prevCards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) return prevCards;
      const newCards = [...prevCards];
      const [swipedCard] = newCards.splice(cardIndex, 1);
      newCards.unshift(swipedCard);
      return newCards;
    });
  };

  useEffect(() => {
    setCards(data);
  }, [data]);

  return (
    <div
      className="grid h-[500px] w-full place-items-center bg-neutral-100"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='%23d4d4d4'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        marginTop: "20px",
        width: "200px",
        height: "150px",
      }}
    >
      {cards.map((card) => {
        return <Card key={card.id} cards={cards} {...card} moveCardToEnd={moveCardToEnd} />;
      })}
    </div>
  );
};

export default ReviewPicsSection;
