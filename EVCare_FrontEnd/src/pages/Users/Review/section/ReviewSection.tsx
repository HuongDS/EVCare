import type { ReviewResponseDto } from "../../../../models/Review/ReviewResponseDto";
import {
  ReviewContainer,
  ReviewCard,
  HeadSection,
  Avatar,
  HeadLeft,
  HeadRight,
  CustomerName,
  CreateAt,
  Divider,
  BodySection,
  ServiceList,
  ExpRow,
  ExpLabel,
  CustomerReview,
} from "./ReviewSection.styled";
import StarRating from "../../../../components/Review/StartRating";

interface ReviewSectionProps {
  reviews: ReviewResponseDto[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  if (!reviews.length) return <div>No reviews yet.</div>;

  return (
    <ReviewContainer>
      {reviews.map((review) => (
        <ReviewCard key={review.id}>
          <HeadSection>
            <HeadLeft>
              <Avatar>{review.customerName.charAt(0).toUpperCase()}</Avatar>
              <CustomerName>{review.customerName}</CustomerName>
            </HeadLeft>
            <HeadRight>
              <CreateAt>
                {new Date(review.createdAt).toLocaleDateString("en-GB")}
              </CreateAt>
            </HeadRight>
          </HeadSection>

          <Divider />

          <BodySection>
            <ServiceList>
              {review.services.map((s) => s.name).join(", ")}
            </ServiceList>

            <ExpRow>
              <ExpLabel>Customer’s Experience</ExpLabel>
              <StarRating rating={review.rating} onRate={() => {}} />
            </ExpRow>

            <CustomerReview
              dangerouslySetInnerHTML={{ __html: review.content }}
            />
          </BodySection>
        </ReviewCard>
      ))}
    </ReviewContainer>
  );
}
