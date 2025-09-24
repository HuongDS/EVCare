import { useState } from "react";
import Rating from "@mui/material/Rating";
import NameBox from "../NameBox";

import {
  DetailWrapper,
  Button,
  Wrapper,
  Backdrop,
  OrderModal,
  Title,
  TitleID,
  Section,
  StaffRow,
  ServiceList,
  ServiceItemBox,
  ReviewBox,
  Icon,
  Row,
  LocationBox,
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

interface Order {
  id: number;
  date: string;
  location: string;
  services: Service[];
  staffs: Staff[];
  review: string;
  rating: number;
}

export default function RatingComponent() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const [order, setOrder] = useState<Order>({
    id: 123456,
    date: "2025-06-13",
    location: "HCM City",
    services: [
      { id: 1, name: "Oil Change" },
      { id: 2, name: "Tire Check" },
      { id: 3, name: "Battery Replacement" },
    ],
    staffs: [
      { id: 1, role: "Service Staff", name: "Alex", rating: 0 },
      { id: 2, role: "Technical Staff", name: "Alice", rating: 0 },
    ],
    review: "",
    rating: 0,
  });

  const openModal = () => {
    setVisible(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeModal = () => setOpen(false);

  const handleAnimationEnd = () => {
    if (!open) setVisible(false);
  };

  const handleStaffRatingChange = (id: number, value: number | null) => {
    if (value === null) return;
    setOrder((prev) => ({
      ...prev,
      staffs: prev.staffs.map((s) =>
        s.id === id ? { ...s, rating: value } : s
      ),
    }));
  };

  const handleServiceRatingChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: number | null
  ) => {
    setOrder((prev) => ({ ...prev, rating: value ?? 0 }));
  };

  const handleReviewChange = (value: string) => {
    setOrder((prev) => ({ ...prev, review: value }));
  };

  const handleSend = () => {
    console.log("Sending to backend:", order);
    alert("Thanks for your Review!");
    closeModal();
  };

  return (
    <DetailWrapper>
      <Button onClick={openModal}>Rating</Button>

      {visible && (
        <Wrapper isOpen={open}>
          <Backdrop isOpen={open} onClick={closeModal} />
          <OrderModal
            isOpen={open}
            onClick={(e) => e.stopPropagation()}
            onTransitionEnd={handleAnimationEnd}
          >
            <Title>Review</Title>
            <TitleID>ID: {order.id}</TitleID>

            {/* Staff Ratings Section */}
            <Section>
              <Title>Staff Ratings</Title>
              {order.staffs.map((staff) => (
                <StaffRow key={staff.id}>
                  <NameBox label={staff.role} name={staff.name} />
                  <div style={{ marginTop: "8.5%" }}>
                    <Rating
                      name={`rating-${staff.id}`}
                      value={staff.rating}
                      onChange={(_, value) =>
                        handleStaffRatingChange(staff.id, value)
                      }
                    />
                  </div>
                </StaffRow>
              ))}

              <Row style={{ marginTop: "10px" }}>
                <NameBox label="Date" name={order.date} />
                <LocationBox>
                  <Icon className="bi bi-geo-alt-fill" />
                  {order.location}
                </LocationBox>
              </Row>
            </Section>

            {/* Services Section */}
            <Section>
              <Title>Services</Title>{" "}
              <StaffRow
                style={{ marginTop: "15px", gridTemplateColumns: "1fr" }}
              >
                <div style={{ textAlign: "center" }}>
                  <Rating
                    name="service-rating"
                    value={order.rating}
                    onChange={handleServiceRatingChange}
                  />
                </div>
              </StaffRow>
              <ServiceList>
                {order.services.map((s) => (
                  <ServiceItemBox key={s.id}>{s.name}</ServiceItemBox>
                ))}
              </ServiceList>
              {/* Tổng rating dịch vụ */}
            </Section>

            {/* Review Section */}
            <Section>
              <Title>Review</Title>
              <ReviewBox
                value={order.review}
                onChange={(e) => handleReviewChange(e.target.value)}
                placeholder="Write your review here..."
              />
            </Section>

            <div style={{ margin: "0", textAlign: "center" }}>
              <Button onClick={handleSend}>Send</Button>
            </div>
          </OrderModal>
        </Wrapper>
      )}
    </DetailWrapper>
  );
}
