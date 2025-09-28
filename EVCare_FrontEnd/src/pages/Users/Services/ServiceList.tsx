import { useState } from "react";
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
import type { ServicesResponseDto } from "../../../models/ServicesModel/Customer_Services_Model";
import { getActiveServices } from "../../../services/getServices";

type SortBy = "default" | "name" | "duration";
type SortOrder = "asc" | "desc";

const ServiceList = () => {
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = getActiveServices("", 1, 3);

  const sortServices = (
    services: ServicesResponseDto[],
    sortBy: SortBy,
    sortOrder: SortOrder
  ): ServicesResponseDto[] => {
    const sorted = [...services].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "duration":
          comparison = a.duration - b.duration;
          break;
        default:
          comparison = a.id - b.id;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  };

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

  const services: ServicesResponseDto[] = data?.data ?? []; // warning
  const sortedServices = sortServices(services, sortBy, sortOrder);

  const handleSortChange = (newSortBy: SortBy): void => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  return (
    <PageContainer>
      <Container>
        <HeaderSection>
          <ServiceLabel>OUR SERVICES</ServiceLabel>
          <MainTitle>Maintenance Your Vehicle</MainTitle>
          <BookButton onClick={() => setShowForm(true)}>
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
              active={sortBy === "name"}
              onClick={() => handleSortChange("name")}
            >
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
            <SortButton
              active={sortBy === "duration"}
              onClick={() => handleSortChange("duration")}
            >
              Duration{" "}
              {sortBy === "duration" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
          </ButtonGroup>
        </SortSection>

        <Row>
          {sortedServices
            .filter((service) => !service.isDeleted)
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
                    <BookServiceButton onClick={() => setShowForm(true)}>
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
