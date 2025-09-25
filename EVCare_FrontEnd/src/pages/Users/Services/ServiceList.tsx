import { useState } from "react";
import { Container, Row, Col, Card, ButtonGroup } from "react-bootstrap";
import {
  FaCog,
  FaBatteryFull,
  FaCar,
  FaWrench,
  FaShieldAlt,
  FaSnowflake,
  FaMobile,
  FaMapMarkerAlt,
  FaPhone,
  FaTachometerAlt,
  FaBolt,
} from "react-icons/fa";

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
  IconContainer,
  ServiceIcon,
  ServiceTitle,
  ServiceDescription,
  FeatureList,
  FeatureItem,
  FeatureBullet,
  BookServiceButton,
  FooterCTA,
  GetInTouchButton,
} from "./ServiceList.styled";
import BookingForm from "../../Customer/Booking/BookingForm";

const ServiceList = () => {
  const [services] = useState([
    {
      id: 1,
      title: "General Check-up",
      description:
        "Ensure your EV runs smoothly and safely with regular inspections",
      icon: FaCog,
      category: "inspection",
      features: [
        "Diagnostic check-up & electronic systems",
        "Assess overall vehicle safety",
      ],
      bgColor: "#f8f9fa",
      iconColor: "#6c757d",
    },
    {
      id: 2,
      title: "Battery Care",
      description: "Extend battery lifespan and maintain peak performance",
      icon: FaBatteryFull,
      category: "battery",
      features: [
        "Check battery capacity & efficiency",
        "Remove battery cells",
        "Minor / maintain battery cooling system",
      ],
      bgColor: "#d4edda",
      iconColor: "#28a745",
    },
    {
      id: 3,
      title: "Charging System",
      description: "Keep your charging system safe and efficient",
      icon: FaCar,
      category: "charging",
      features: [
        "Inspect on-board charger",
        "Check charging port & cables",
        "Calibrate & update onboard software",
      ],
      bgColor: "#cce7ff",
      iconColor: "#007bff",
    },
    {
      id: 4,
      title: "Motor & Drivetrain",
      description: "Ensure maximum motor lifespan & performance",
      icon: FaWrench,
      category: "motor",
      features: [
        "Inspect electric motor",
        "Check gearbox & drive shafts",
        "Maintain magnetic system",
      ],
      bgColor: "#ffe8cc",
      iconColor: "#fd7e14",
    },
    {
      id: 5,
      title: "Regenerative Braking",
      description: "Optimize braking efficiency and energy recovery",
      icon: FaShieldAlt,
      category: "braking",
      features: [
        "Test regen system brake",
        "Calibrate brake levels",
        "Replace brake pads & brake fluid when needed",
      ],
      bgColor: "#f8d7da",
      iconColor: "#dc3545",
    },
    {
      id: 6,
      title: "Suspension & Steering",
      description: "Enhance comfort and safety on every drive",
      icon: FaTachometerAlt,
      category: "suspension",
      features: [
        "Inspect shock absorbers & springs",
        "Wheel alignment & steering adjustments",
      ],
      bgColor: "#e2e3ff",
      iconColor: "#6610f2",
    },
    {
      id: 7,
      title: "Air Conditioning & Climate Control",
      description: "Stay comfortable in all weather conditions",
      icon: FaSnowflake,
      category: "climate",
      features: [
        "Check electric compressor",
        "Clean evaporator & condenser",
        "Inspect heat pump system",
      ],
      bgColor: "#ccf2ff",
      iconColor: "#20c997",
    },
    {
      id: 8,
      title: "Software & Connectivity",
      description: "Keep your EV smart, updated and connected",
      icon: FaMobile,
      category: "software",
      features: [
        "Update vehicle firmware",
        "System diagnostics & optimization",
        "Connectivity troubleshooting",
      ],
      bgColor: "#fce4ec",
      iconColor: "#e91e63",
    },
    {
      id: 9,
      title: "Safety & Comfort",
      description: "Protect you and your passengers with safety systems",
      icon: FaMapMarkerAlt,
      category: "safety",
      features: [
        "Test airbags & active safety systems",
        "Interior inspection",
        "Emergency response & smart key systems",
      ],
      bgColor: "#d4edda",
      iconColor: "#28a745",
    },
    {
      id: 10,
      title: "Interior & Exterior Care",
      description: "Maintain its clean, fresh, and stylish look for your EV",
      icon: FaCar,
      category: "care",
      features: [
        "Check magazines & battery management safety",
        "Exterior detailing",
        "Wax & spray & protective coating",
      ],
      bgColor: "#cce7ff",
      iconColor: "#007bff",
    },
    {
      id: 11,
      title: "Tire & Wheel",
      description: "Ensure better, safe efficiency and quality on the road",
      icon: FaTachometerAlt,
      category: "tire",
      features: [
        "Tire inspection & balancing",
        "Air pressure monitoring system check",
        "Replace worn tires",
      ],
      bgColor: "#f8f9fa",
      iconColor: "#6c757d",
    },
    {
      id: 12,
      title: "Electrical System & Wiring",
      description: "Keep your EV's electrical system running without issues",
      icon: FaBolt,
      category: "electrical",
      features: [
        "Inspect high-voltage cables",
        "Check electrical connections",
        "Maintain auxiliary electrical systems",
      ],
      bgColor: "#fff3cd",
      iconColor: "#ffc107",
    },
  ]);

  interface Service {
    id: number;
    title: string;
    description: string;
    category: string;
    features: string[];
    icon: React.ComponentType;
    bgColor: string;
    iconColor: string;
  }

  type SortBy = "default" | "title" | "category";
  type SortOrder = "asc" | "desc";

  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showForm, setShowForm] = useState(false);

  const sortServices = (
    services: Service[],
    sortBy: SortBy,
    sortOrder: SortOrder
  ): Service[] => {
    const sorted = [...services].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = a.id - b.id;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return sorted;
  };

  const sortedServices: Service[] = sortServices(services, sortBy, sortOrder);

  const handleSortChange = (newSortBy: SortBy): void => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handleBookService = () => {
    setShowForm(true);
  };

  const handleGetInTouch = () => {
    console.log("Get in touch clicked");
  };

  return (
    <PageContainer>
      <Container>
        <HeaderSection>
          <ServiceLabel>OUR SERVICES</ServiceLabel>
          <MainTitle>Maintenance Your Vehicle</MainTitle>
          <BookButton onClick={handleBookService}>Book a Service →</BookButton>
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
              active={sortBy === "title"}
              onClick={() => handleSortChange("title")}
            >
              Name {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
            <SortButton
              active={sortBy === "category"}
              onClick={() => handleSortChange("category")}
            >
              Category{" "}
              {sortBy === "category" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
          </ButtonGroup>
        </SortSection>

        <Row>
          {sortedServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
                <ServiceCard>
                  <Card.Body>
                    <IconContainer>
                      <ServiceIcon color={service.iconColor}>
                        <IconComponent />
                      </ServiceIcon>
                    </IconContainer>

                    <ServiceTitle>{service.title}</ServiceTitle>
                    <ServiceDescription>
                      {service.description}
                    </ServiceDescription>

                    <FeatureList>
                      {service.features.map((feature, index) => (
                        <FeatureItem key={index}>
                          <FeatureBullet color={service.iconColor} />
                          <span>{feature}</span>
                        </FeatureItem>
                      ))}
                    </FeatureList>

                    <BookServiceButton onClick={handleBookService}>
                      Book This Service
                    </BookServiceButton>
                  </Card.Body>
                </ServiceCard>
              </Col>
            );
          })}
        </Row>

        <FooterCTA>
          <GetInTouchButton onClick={handleGetInTouch}>
            <FaPhone />
            Get In Touch →
          </GetInTouchButton>
        </FooterCTA>
      </Container>
      <BookingForm show={showForm} handleClose={() => setShowForm(false)} />
    </PageContainer>
  );
};

export default ServiceList;
