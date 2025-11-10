import React from "react";
import { StarWrapper } from "./Review.styled.tsx";

interface StarRatingProps {
  rating: number;
  onRate: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRate }) => {
  return (
    <StarWrapper>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${rating >= star ? "active" : ""}`}
            onClick={() => onRate(star)}
          >
            ★
          </span>
        ))}
      </div>
    </StarWrapper>
  );
};

export default StarRating;
