import React from "react";

interface ReviewButtonProps {
  onOpen: () => void;
}

const ReviewButton: React.FC<ReviewButtonProps> = ({ onOpen }) => {
  return (
    <button className="review-button" onClick={onOpen}>
      <span className="review-icon">★</span>
      <span>Write a Review</span>
    </button>
  );
};

export default ReviewButton;
