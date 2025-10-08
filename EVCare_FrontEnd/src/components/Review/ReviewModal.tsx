import React, { useState } from "react";
import ReviewForm from "./ReviewForm";
import SuccessMessage from "./SuccessMessage";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (data: ReviewCreateDto) => {
    console.log("Review submitted:", data);
    setSubmitted(true);
    setTimeout(onClose, 2500);
  };

  if (!open) return null;

  return (
    <div className="modal active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        {!submitted ? <ReviewForm onSubmit={handleSubmit} onCancel={onClose} /> : <SuccessMessage onClose={onClose} />}
      </div>
    </div>
  );
};

export default ReviewModal;
