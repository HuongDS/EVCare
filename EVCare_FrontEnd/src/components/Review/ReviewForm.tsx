import React, { useState } from "react";
import StarRating from "./StartRating";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto";

interface ReviewFormProps {
  onSubmit: (data: ReviewCreateDto) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const ratingTexts = ["Please select a rating", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ReviewCreateDto = {
      rating,
      review,
      appointmentId: 0,
      name: "John Doe",
      phone: "+84 123 456 789",
      timestamp: new Date().toISOString(),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="modal-header">
        <h2 className="modal-title">Share Your Experience</h2>
        <button type="button" className="close-btn" onClick={onCancel}>
          ×
        </button>
      </div>

      <div className="info-section">
        <div className="info-item">
          <div className="info-label">Service Used</div>
          <div className="info-value">Battery Health Check & Maintenance</div>
        </div>
      </div>

      <div className="info-grid">
        <div className="info-item">
          <div className="info-label">Customer Name</div>
          <div className="info-value">John Doe</div>
        </div>
        <div className="info-item">
          <div className="info-label">Phone Number</div>
          <div className="info-value">+84 123 456 789</div>
        </div>
      </div>

      <div className="rating-section">
        <div className="rating-label">Rate Your Experience</div>
        <div className="rating-container">
          <StarRating rating={rating} onRate={setRating} />
          <div className="rating-value">{rating ? `${rating}/5` : "—"}</div>
        </div>
        <div className="rating-text">{ratingTexts[rating]}</div>
      </div>

      <div className="form-section">
        <label className="form-label">Your Feedback</label>
        <div className="textarea-container">
          <textarea
            className="form-textarea"
            placeholder="Share your thoughts about the service quality, staff professionalism, and overall experience..."
            value={review}
            maxLength={500}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <span className="char-counter">{review.length}/500</span>
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="submit-btn" disabled={!(rating > 0 && review.trim().length > 0)}>
          Submit Review
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
