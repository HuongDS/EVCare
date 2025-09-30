import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Spinner,
} from "react-bootstrap";
import {
  PageContainer,
  HeaderSection,
  ServiceLabel,
  MainTitle,
  BookButton,
  SortSection,
  SortLabel,
  SortButton,
  ServiceCard,
  ServiceTitle,
  ServiceDescription,
  BookServiceButton,
  FooterCTA,
  GetInTouchButton,
} from "./ServiceList.styled";
import BookingForm from "../../Customer/Booking/BookingForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../states/store";
import {
  closeAppointmentForm,
  openAppointmentForm,
  openLogin,
  setAction,
} from "../../../states/uiSlice";
import { ACTION } from "../../../constants/messages/Actions";
import { getAllActiveService } from "../../../services/servicesApi";

type SortBy = "default" | "Name" | "Duration";
type SortOrder = "asc" | "desc";

const ServiceList = () => {
  const [sortBy, setSortBy] = useState<SortBy>("default");

  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isSuccess } = getAllActiveService(
    "a",
    10,
    1,
    // sortBy !== "default" ? [sortBy] : [],
    // sortBy !== "default" ? [sortOrder] : []
    "Name",
    "asc"
  );
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { createAppointmentFormOpen } = useSelector(
    (state: RootState) => state.ui
  );

  useEffect(() => {
    if (createAppointmentFormOpen) {
      setShowForm(true);
      dispatch(closeAppointmentForm());
    }
  }, [createAppointmentFormOpen, dispatch]);

  if (isLoading) {
    return (
      <PageContainer>
        <Container className="text-center mt-5">
          <Spinner animation="border" />
          <p>Loading services...</p>
        </Container>
      </PageContainer>
    );
  }

  const handleSortChange = (newSortBy: SortBy): void => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleOpenBookingForm = () => {
    if (!isAuthenticated) {
      dispatch(setAction(ACTION.OPEN_APPOINTMENT));
      dispatch(openLogin());
      return;
    }
    dispatch(openAppointmentForm());
  };

  return (
    <PageContainer>
      <Container>
        <HeaderSection>
          <ServiceLabel>OUR SERVICES</ServiceLabel>
          <MainTitle>Maintenance Your Vehicle</MainTitle>

          <BookButton onClick={handleOpenBookingForm}>
            Book a Service →
          </BookButton>
        </HeaderSection>

        <SortSection>
          <SortLabel>Sort by:</SortLabel>
          <ButtonGroup>
            <SortButton
              active={sortBy === "default"}
              onClick={() => handleSortChange("default")}
            >
              Default{" "}
              {sortBy === "default" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
            <SortButton
              active={sortBy === "Name"}
              onClick={() => handleSortChange("Name")}
            >
              Name {sortBy === "Name" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
            <SortButton
              active={sortBy === "Duration"}
              onClick={() => handleSortChange("Duration")}
            >
              Duration{" "}
              {sortBy === "Duration" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
          </ButtonGroup>
        </SortSection>

        <Row>
          {isSuccess &&
            data?.data?.items
              ?.filter((service) => !service.isDeleted)
              .map((service) => (
                <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
                  <ServiceCard>
                    <Card.Body>
                      <ServiceTitle>{service.name}</ServiceTitle>
                      <ServiceDescription>
                        {service.description}
                      </ServiceDescription>
                      <p>
                        <strong>Duration:</strong> {service.duration} hours
                      </p>

                      <BookServiceButton onClick={handleOpenBookingForm}>
                        Book This Service
                      </BookServiceButton>
                    </Card.Body>
                  </ServiceCard>
                </Col>
              ))}
        </Row>
        <FooterCTA>
          <GetInTouchButton>Get In Touch →</GetInTouchButton>
        </FooterCTA>
      </Container>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} />
    </PageContainer>
  );
};

export default ServiceList;
