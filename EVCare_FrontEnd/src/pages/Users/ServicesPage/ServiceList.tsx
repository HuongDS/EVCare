import { useCallback, useEffect, useState } from "react";
import { ButtonGroup, Container } from "react-bootstrap";
import { ReactLenis } from "lenis/react";
import { motion, type Variants } from "framer-motion";

import {
  HeaderSection,
  ServiceLabel,
  MainTitle,
  BookButton,
  SortSection,
  SortLabel,
  SortButton,
  ServicesContainer,
  ServiceStorySection,
  ServiceImageContainer,
  ServiceTextContainer,
  ServiceTitle,
  ServiceDescription,
  ServiceDuration,
  StickyBookButton,
  ServiceListContainer,
} from "./ServiceList.styled";

import BookingForm from "../../Customer/Booking/BookingForm"; // Đảm bảo đường dẫn đúng
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../states/store"; // Đảm bảo đường dẫn đúng
import { closeAppointmentForm, openAppointmentForm, openLogin, setAction } from "../../../states/uiSlice"; // Đảm bảo đường dẫn đúng
import { ACTION } from "../../../constants/messages/Actions"; // Đảm bảo đường dẫn đúng
import { getAllActiveService } from "../../../services/servicesApi"; // Đảm bảo đường dẫn đúng
import ServiceCarousel from "./ServiceCarousel"; // Đảm bảo đường dẫn đúng
import { Pagination } from "../../../components/Paginations/Pagination"; // Đảm bảo đường dẫn đúng
import SearchBar from "../../../components/SearchBar/Search"; // Đảm bảo đường dẫn đúng
import { LIST_SERVICES_MESSAGE } from "../../../constants/messages/Message"; // Đảm bảo đường dẫn đúng
import type { ServicesResponseDto } from "../../../models/ServicesModel/Customer_Services_Model"; // Đảm bảo đường dẫn đúng
import SpinnerComponent from "../../../components/SpinnerComponent"; // Đảm bảo đường dẫn đúng
import { NOT_FOUND_ITEMS } from "../../../components/MessageStyled/MessageStyled"; // Đảm bảo đường dẫn đúng
import { FiArrowRight } from "react-icons/fi";

type SortBy = "Name" | "Duration";
type SortOrder = "asc" | "desc";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] },
  },
};

const ServiceList = () => {
  const [sortBy, setSortBy] = useState<SortBy>("Name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showForm, setShowForm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [currenPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [isHaveData, setIsHaveData] = useState(true);

  const { data, isLoading, isSuccess } = getAllActiveService(searchValue, 9, currenPage, sortBy, sortOrder);

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { createAppointmentFormOpen } = useSelector((state: RootState) => state.ui);

  const handleSortChange = useCallback(
    (newSortBy: SortBy): void => {
      if (newSortBy === sortBy) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(newSortBy);
        setSortOrder("asc");
      }
      setCurrentPage(1);
    },
    [sortBy, sortOrder]
  );

  const handleOpenBookingForm = useCallback(() => {
    if (!isAuthenticated) {
      dispatch(setAction(ACTION.OPEN_APPOINTMENT));
      dispatch(openLogin());
      return;
    }
    dispatch(openAppointmentForm());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (data?.data?.items?.length === 0) {
      setIsHaveData(false);
    } else {
      setIsHaveData(true);
    }
  }, [data]);

  useEffect(() => {
    if (createAppointmentFormOpen) {
      setShowForm(true);
      dispatch(closeAppointmentForm());
    }
  }, [createAppointmentFormOpen, dispatch]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchValue = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  const placeholderImages = [
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560611/services/504350ff-f752-4fe5-8245-8878cd7dfbc5.jpg",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560706/services/2e5e97a2-a7a1-46b3-bd19-9f87218af709.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560740/services/cde265d1-eadb-41e0-9d87-24ca48df97f3.jpg",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560781/services/d944eca5-3edc-4da4-bdb6-332ba569ec5f.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560845/services/35f3c5f0-03c1-433c-bab8-1e251817d251.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560906/services/49c8d5c8-a978-44cd-8ed5-d9f7c08ee251.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763560927/services/d23b568f-b96d-4990-b37f-73e2effa2aa0.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763561065/services/e6945e06-64fd-48e9-9bae-6492efd97778.webp",
    "https://res.cloudinary.com/ddojmkykj/image/upload/v1763561088/services/4b2c2ea2-4188-4c36-87e2-2b937ffc58da.webp",
  ];

  return (
    <ReactLenis root options={{ lerp: 0.08 }}>
      <ServiceListContainer>
        <HeaderSection>
          <ServiceLabel>OUR SERVICES</ServiceLabel>
          <MainTitle>Maintenance Your Vehicle</MainTitle>
          {loadingForm ? (
            <SpinnerComponent />
          ) : (
            <BookButton onClick={handleOpenBookingForm}>
              Book a Service <FiArrowRight />
            </BookButton>
          )}
        </HeaderSection>
        <ServiceCarousel />
        <Container>
          <SortSection id="service-list-start">
            <ButtonGroup>
              <SortLabel>Sort by:</SortLabel>
              <SortButton active={sortBy === "Name"} onClick={() => handleSortChange("Name")}>
                Name {sortBy === "Name" && (sortOrder === "asc" ? "↑" : "↓")}
              </SortButton>
              <SortButton active={sortBy === "Duration"} onClick={() => handleSortChange("Duration")}>
                Duration {sortBy === "Duration" && (sortOrder === "asc" ? "↑" : "↓")}
              </SortButton>
            </ButtonGroup>
            <SearchBar
              handleSearchValue={handleSearchValue}
              placeholder="Search services..."
              searchValue={searchValue}
            />
          </SortSection>
          <ServicesContainer>
            {isLoading && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <SpinnerComponent />
                <p>Loading services...</p>
              </div>
            )}

            {!isLoading && !isHaveData && (
              <div style={{ gridColumn: "1 / -1" }}>
                <NOT_FOUND_ITEMS icon="bi bi-sticky" message={LIST_SERVICES_MESSAGE.EMPTY + `${searchValue}`} />
              </div>
            )}

            {isSuccess &&
              data?.data?.items
                ?.filter((service: ServicesResponseDto) => !service.isDeleted)
                .map((service: ServicesResponseDto, index: number) => (
                  <ServiceStorySection
                    key={service.id}
                    $imagePosition={index % 2 === 0 ? "left" : "right"}
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <ServiceImageContainer>
                      <motion.img
                        src={placeholderImages[index % placeholderImages.length]}
                        alt={service.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </ServiceImageContainer>
                    <ServiceTextContainer>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <ServiceTitle>{service.name}</ServiceTitle>
                        <ServiceDescription>{service.description}</ServiceDescription>
                        <ServiceDuration>
                          <strong>Duration:</strong> {service.duration} hours
                        </ServiceDuration>
                      </motion.div>
                    </ServiceTextContainer>
                  </ServiceStorySection>
                ))}
          </ServicesContainer>
          {!isLoading && isHaveData && (
            <div data-aos="fade-up">
              <Pagination
                pageIndex={currenPage}
                pageSize={9}
                totalItems={data?.data?.totalItems || 1}
                totalPage={data?.data?.totalPages || 1}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </Container>
        <StickyBookButton
          onClick={handleOpenBookingForm}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          whileHover={!loadingForm ? { scale: 1.05 } : {}}
          whileTap={!loadingForm ? { scale: 0.95 } : {}}
          disabled={loadingForm}
          $isLoading={loadingForm}
        >
          {loadingForm && <span className="button-spinner" />}
          Book Now <FiArrowRight />
        </StickyBookButton>
        <BookingForm
          loading={loadingForm}
          setLoading={setLoadingForm}
          show={showForm}
          handleClose={() => setShowForm(false)}
        />
      </ServiceListContainer>
    </ReactLenis>
  );
};

export default ServiceList;
