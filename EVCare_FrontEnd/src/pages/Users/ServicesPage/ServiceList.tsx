import { useCallback, useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ButtonGroup, Card, Container, Row } from "react-bootstrap";
import {
  PageContainer,
  HeaderSection,
  ServiceLabel,
  MainTitle,
  BookButton,
  ServiceCard,
  ServiceTitle,
  ServiceDescription,
  SortSection,
  SortLabel,
  SortButton,
} from "./ServiceList.styled";
import BookingForm from "../../Customer/Booking/BookingForm";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../states/store";
import { closeAppointmentForm, openAppointmentForm, openLogin, setAction } from "../../../states/uiSlice";
import { ACTION } from "../../../constants/messages/Actions";
import { getAllActiveService } from "../../../services/servicesApi";
import ServiceCarousel from "./ServiceCarousel";
import { Col } from "antd";
import { Pagination } from "../../../components/Paginations/Pagination";
import SearchBar from "../../../components/SearchBar/Search";
import { LIST_SERVICES_MESSAGE } from "../../../constants/messages/Message";
import type { ServicesResponseDto } from "../../../models/ServicesModel/Customer_Services_Model";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { NOT_FOUND_ITEMS } from "../../../components/MessageStyled/MessageStyled";

type SortBy = "Name" | "Duration";
type SortOrder = "asc" | "desc";

const ServiceList = () => {
  const [sortBy, setSortBy] = useState<SortBy>("Name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSearchValue = (searchValue: string) => {
    setSearchValue(searchValue);
  };

  //khi searchValue đổi thì pageCurrent về trang đầu
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <PageContainer>
      <HeaderSection>
        <ServiceLabel>OUR SERVICES</ServiceLabel>
        <MainTitle>Maintenance Your Vehicle</MainTitle>

        {loading ? <SpinnerComponent /> : <BookButton onClick={handleOpenBookingForm}>Book a Service →</BookButton>}
      </HeaderSection>

      <ServiceCarousel />

      <Container>
        <SortSection>
          <ButtonGroup>
            <SortLabel>Sort by:</SortLabel>
            <SortButton active={sortBy === "Name"} onClick={() => handleSortChange("Name")}>
              Name {sortBy === "Name" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
            <SortButton active={sortBy === "Duration"} onClick={() => handleSortChange("Duration")}>
              Duration {sortBy === "Duration" && (sortOrder === "asc" ? "↑" : "↓")}
            </SortButton>
          </ButtonGroup>

          <SearchBar handleSearchValue={handleSearchValue} placeholder="Search services..." searchValue={searchValue} />
        </SortSection>

        <Row style={{ justifyContent: "center" }}>
          {isLoading && (
            <PageContainer>
              <Container className="text-center mt-5">
                <SpinnerComponent />
                <p>Loading services...</p>
              </Container>
            </PageContainer>
          )}

          {!isHaveData && (
            <h3
              style={{
                color: "red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {<NOT_FOUND_ITEMS icon="bi bi-sticky" message={LIST_SERVICES_MESSAGE.EMPTY + `${searchValue}`} />}
            </h3>
          )}
          {isSuccess &&
            data?.data?.items
              ?.filter((service: ServicesResponseDto) => !service.isDeleted)
              .map((service: ServicesResponseDto) => (
                <Col key={service.id} xs={12} md={6} lg={4} className="mb-4">
                  <ServiceCard>
                    <Card.Body>
                      <ServiceTitle>{service.name}</ServiceTitle>
                      <ServiceDescription>{service.description}</ServiceDescription>
                      <p>
                        <strong>Duration:</strong> {service.duration} hours
                      </p>

                      {/* <BookServiceButton onClick={handleOpenBookingForm}>
                        Book This Service
                      </BookServiceButton> */}
                    </Card.Body>
                  </ServiceCard>
                </Col>
              ))}
        </Row>
        {isHaveData && (
          <Pagination
            pageIndex={currenPage}
            pageSize={9}
            totalItems={data?.data?.totalItems || 1}
            totalPage={data?.data?.totalPages || 1}
            onPageChange={onPageChange}
          />
        )}
      </Container>
      <BookingForm loading={loading} setLoading={setLoading} show={showForm} handleClose={() => setShowForm(false)} />
    </PageContainer>
  );
};

export default ServiceList;
