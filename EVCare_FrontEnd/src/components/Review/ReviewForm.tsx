import React, { useEffect, useState } from "react";
import StarRating from "./StartRating";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto.ts";
import { ReviewWrapper } from "./Review.styled.tsx";
import type { AppointmentViewDetailModel } from "../../models/AppointmentsModel/AppointmentViewDetailModel.ts";
import { Editor } from "@tinymce/tinymce-react";

interface ReviewFormProps {
  onSubmit: (data: ReviewCreateDto) => void;
  onCancel: () => void;
  appointmentData: AppointmentViewDetailModel;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel, appointmentData }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const ratingTexts = ["Please select a rating", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const [data, setData] = useState<AppointmentViewDetailModel | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ReviewCreateDto = {
      appointmentId: appointmentData.id,
      content: review,
      rating: rating,
    };
    onSubmit(data);
  };

  useEffect(() => {
    setData(appointmentData);
  }, [appointmentData]);

  return (
    <ReviewWrapper>
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
            {data?.services.map((item) => (
              <div className="info-value" key={item.id}>
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <div className="info-label">Customer Name</div>
            <div className="info-value">{data?.customerName}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Phone Number</div>
            <div className="info-value">{data?.phoneNumber}</div>
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
            {/*<textarea*/}
            {/*    className="form-textarea"*/}
            {/*    placeholder="Share your thoughts about the service quality, staff professionalism, and overall experience..."*/}
            {/*    value={review}*/}
            {/*    maxLength={500}*/}
            {/*    onChange={(e) => setReview(e.target.value)}*/}
            {/*    required*/}
            {/*/>*/}
            <Editor
              apiKey={import.meta.env.VITE_TINY_KEY}
              value={review}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                ],
                toolbar:
                  "undo redo | formatselect | " +
                  "bold italic underline | bullist numlist outdent indent | " +
                  "removeformat | help",
                content_style: "body { font-family:Outfit,sans-serif; font-size:15px; line-height:1.6; }",
              }}
              onEditorChange={(newValue) => setReview(newValue)}
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
    </ReviewWrapper>
  );
};

export default ReviewForm;
