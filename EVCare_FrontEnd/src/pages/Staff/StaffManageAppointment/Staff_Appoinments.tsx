import SortTable from "../StaffComponents/SortTable";
import { AppointmentStatusEnum } from "../../../models/enums";
import styled from "styled-components";
import AppointmentCard from "../StaffComponents/AppointmentCard";
import {
  useGetAllAppointments,
  useGetAppointmentHaveTech,
} from "../../../services/appointmentServiceApi";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useEffect, useState } from "react";
import Appoinment_Progress_Modal from "./Appoinment_Progress_Modal";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../../components/Paginations/Pagination";
import { LIST_APPOINTMENTS_MESSAGE } from "./../../../constants/messages/Message";
import { NOT_FOUND_ITEMS } from "../../../components/MessageStyled/MessageStyled";
import Appointment_Reassign from "./Appointment_Reassign";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";

export default function Staff_Appoinments() {
  const queryClient = useQueryClient();
  const name = AppointmentStatusEnum;
  const [sortBy, setSortBy] = useState("Pending");
  // const [sortField, setSortField] = useState("AppointmentDate");
  // const [sortOrder, setSortOrder] = useState("desc");
  const [currenPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<StaffAppointmentsDto<TechnicianModel<TechnicianSkills>> | null>(
      null
    );

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);

  const handleOpenProgress = (
    appointment: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
  ) => {
    setSelectedAppointment(appointment);
    setShowProgressModal(true);
  };

  const handleOpenReassign = (
    appointment: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
  ) => {
    setSelectedAppointment(appointment);
    setShowReassignModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowProgressModal(false);
    setShowReassignModal(false);
    queryClient.invalidateQueries({
      queryKey: ["Staff Appointments"],
    });
  };

  const handleSortBy = (status: string) => {
    setSortBy(status);
  };

  //Gọi api lấy list cuộc hẹn
  const { data: appointments, isLoading } = useGetAllAppointments({
    ...((searchValue && { customerName: searchValue }) || {}), //chỉ gửi customer name nếu nó k rỗng
    status: sortBy,
    // sortField: sortField,
    // sortOrder: sortOrder,
    pageIndex: currenPage,
    pageSize: 10,
  });

  //Lấy các cuộc hẹn có technician onleave

  const { data: appointmentsHaveTech } = useGetAppointmentHaveTech({});

  //hàm check appointment có technician rời việc hay không
  const checkTechnicianOnleave = (id: number) => {
    return (
      appointmentsHaveTech?.data?.items?.some(
        (appointment) => appointment.id === id
      ) || false
    );
  };

  //phân trang
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  //search
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  //trở về trang đầu khi search
  useEffect(() => setCurrentPage(1), [searchValue]);

  //Sort By
  const sortName = [
    name.PENDING,
    name.CONFIRMED,
    name.CHECKED_IN,
    name.ADDING_PART,
    name.IN_PROGRESS,
    "ReadyForPickup",
    name.DONE,
    name.CANCELED,
  ];

  return (
    <>
      <AppoitmentWrapper>
        <TitleWrapper>
          <h2>Appoinments</h2>
          <SearchBar
            placeholder="Search appointments..."
            handleSearchValue={handleSearch}
          />
        </TitleWrapper>
        <SortTable sortName={sortName} handleSortBy={handleSortBy} />
        <SpinnerStyled>{isLoading && <SpinnerComponent />}</SpinnerStyled>
        <ListAppointmentStyled>
          {appointments?.data?.items?.length !== 0 ? (
            appointments?.data?.items?.map(
              (
                item: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
              ) => (
                <AppointmentCard
                  key={item.id}
                  data={item}
                  onOpenProgress={() => handleOpenProgress(item)}
                  hasTechnicianOnleave={checkTechnicianOnleave(item.id)}
                  onOpenReassign={() => handleOpenReassign(item)}
                />
              )
            )
          ) : (
            <NOT_FOUND_ITEMS
              icon="bi bi-exclamation-circle"
              message={LIST_APPOINTMENTS_MESSAGE.EMPTY_PENDING(sortBy)}
            />
          )}

          {!isLoading && (
            <Pagination
              pageIndex={currenPage}
              pageSize={5}
              totalItems={appointments?.data?.totalItems || 1}
              totalPage={appointments?.data?.totalPages || 1}
              onPageChange={onPageChange}
            />
          )}
        </ListAppointmentStyled>
      </AppoitmentWrapper>
      {showProgressModal && selectedAppointment && (
        <Appoinment_Progress_Modal
          show={showProgressModal}
          close={handleCloseModal}
          data={selectedAppointment}
        />
      )}

      {showReassignModal && selectedAppointment && (
        <Appointment_Reassign
          show={showReassignModal}
          close={handleCloseModal}
          data={selectedAppointment}
        />
      )}
    </>
  );
}

const AppoitmentWrapper = styled.div``;

const ListAppointmentStyled = styled.div`
  max-height: 70vh;
  overflow-y: auto;
`;

const TitleWrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-family: "Outfit", sans-serif;
    font-weight: 600;
    color: #4caf50;
  }
`;

const SpinnerStyled = styled.div`
  position: fixed;
  top: 55%;
  left: 55%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
