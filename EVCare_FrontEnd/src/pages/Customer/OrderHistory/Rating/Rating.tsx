import { useState } from "react";
import Rating from "@mui/material/Rating";
import NameBox from "../NameBox";
import DateBox from "../DateBox";
import {
  RatingWrapper,
  Title,
  Button,
  Backdrop,
  RatingModal,
  Wrapper,
  Legend,
  RowWapper,
  RowInfo,
  RowService,
  RowReview,
  TitleID,
  StaffRow,
  LocationBox,
  RowDateLocation,
  Icon,
  ReviewBox,
  ServiceList,
  ServiceItemBox,
} from "./Rating.styled";

interface Staff {
  id: number;
  role: string;
  name: string;
  rating: number;
}

interface Service {
  id: number;
  name: string;
}

export default function RatingComponent() {
  const [visible, setVisible] = useState(false); // mount/unmount modal
  const [open, setOpen] = useState(false); // animation state
  const [reviewText, setReviewText] = useState("");
  const [staffs, setStaffs] = useState<Staff[]>([
    { id: 1, role: "Service Staff", name: "Alex", rating: 0 },
    { id: 2, role: "Technical Staff", name: "Alice", rating: 0 },
  ]);

  const services: Service[] = [
    { id: 1, name: "Oil Change" },
    { id: 2, name: "Tire Check" },
    { id: 3, name: "Battery Replacement" },
  ];

  const openModal = () => {
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => setOpen(false);

  const handleAnimationEnd = () => {
    if (!open) setVisible(false);
  };

  const handleRatingChange = (id: number, value: number | null) => {
    if (value === null) return;
    setStaffs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rating: value } : s))
    );
  };

  const handleSend = () => {
    console.log("Sending to backend:", { staffs, review: reviewText });
    alert("Thanks for your Review!");
    closeModal();
  };

  return (
    <RatingWrapper>
      <Button onClick={openModal}>Rating</Button>

      {visible && (
        <Wrapper isOpen={open}>
          <Backdrop isOpen={open} onClick={closeModal} />
          <RatingModal
            isOpen={open}
            onClick={(e) => e.stopPropagation()}
            onTransitionEnd={handleAnimationEnd}
          >
            <Title>Review</Title>
            <TitleID>ID:123456</TitleID>

            <RowWapper>
              <RowInfo>
                <Legend>Staff Ratings</Legend>
                {staffs.map((staff) => (
                  <StaffRow key={staff.id}>
                    <NameBox label={staff.role} name={staff.name} />
                    <Rating
                      name={`rating-${staff.id}`}
                      value={staff.rating}
                      onChange={(_, value) =>
                        handleRatingChange(staff.id, value)
                      }
                    />
                  </StaffRow>
                ))}

                <RowDateLocation>
                  <DateBox date="2025-06-13" />
                  <LocationBox>
                    <Icon className="bi bi-geo-alt-fill" /> HCM
                  </LocationBox>
                </RowDateLocation>
              </RowInfo>

              <RowService>
                <Legend>Services</Legend>
                <ServiceList>
                  {services.map((s) => (
                    <ServiceItemBox key={s.id}>{s.name}</ServiceItemBox>
                  ))}
                </ServiceList>
              </RowService>

              <RowReview>
                <Legend>Review</Legend>
                <ReviewBox
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                />
              </RowReview>

              <Button onClick={handleSend}>Send</Button>
            </RowWapper>
          </RatingModal>
        </Wrapper>
      )}
    </RatingWrapper>
  );
}
