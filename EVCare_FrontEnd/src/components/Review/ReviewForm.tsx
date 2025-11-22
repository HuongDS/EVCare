import React, { useEffect, useState } from "react";
import StarRating from "./StartRating";
import type { ReviewCreateDto } from "../../models/Review/ReviewCreateDto.ts";
import {
  ReviewFormContainer,
  ModalOverlay,
  ModalHeader,
  ModalTitle,
  CloseButton,
  InfoSection,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  RatingSection,
  RatingLabel,
  RatingContainer,
  RatingText,
  FormSection,
  FormLabel,
  TextareaContainer,
  CharCounter,
  ButtonGroup,
  SubmitButton,
  CancelButton,
} from "./Review.styled";

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

  const handleEditorChange = (content: string) => {
    setReview(content);
  };

  return (
    <ModalOverlay>
      <ReviewFormContainer>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Share Your Experience</ModalTitle>
            <CloseButton type="button" onClick={onCancel}>
              ×
            </CloseButton>
          </ModalHeader>

          <InfoSection>
            <InfoItem>
              <InfoLabel>Service Used</InfoLabel>
              {data?.services.map((item) => (
                <InfoValue key={item.id}>{item.name}</InfoValue>
              ))}
            </InfoItem>
          </InfoSection>

          <InfoGrid>
            <InfoItem>
              <InfoLabel>Customer Name</InfoLabel>
              <InfoValue>{data?.customerName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phone Number</InfoLabel>
              <InfoValue>{data?.phoneNumber ?? "N/A"}</InfoValue>
            </InfoItem>
          </InfoGrid>

          <RatingSection>
            <RatingLabel>Rate Your Experience</RatingLabel>
            <RatingContainer>
              <StarRating rating={rating} onRate={setRating} />
              <div className="rating-value">{rating ? `${rating}/5` : "—"}</div>
            </RatingContainer>
            <RatingText>{ratingTexts[rating]}</RatingText>
          </RatingSection>

          <FormSection>
            <FormLabel>Your Feedback</FormLabel>
            <TextareaContainer>
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
                  content_style:
                    "body { font-family:'Outfit',sans-serif; font-size:15px; line-height:1.6; color: #334155; }",
                  skin: "oxide",
                  content_css: "default",
                }}
                onEditorChange={handleEditorChange}
              />
              <CharCounter>{review.length}/500</CharCounter>
            </TextareaContainer>
          </FormSection>

          <ButtonGroup>
            <SubmitButton type="submit" disabled={!(rating > 0 && review.trim().length > 0)}>
              Submit Review
            </SubmitButton>
            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>
          </ButtonGroup>
        </form>
      </ReviewFormContainer>
    </ModalOverlay>
  );
};

export default ReviewForm;
