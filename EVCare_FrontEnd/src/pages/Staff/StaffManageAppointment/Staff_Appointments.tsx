import SortTable from "../StaffComponents/SortTable";
import { AppointmentStatusEnum } from "../../../models/enums";
import AppointmentCard from "../StaffComponents/AppointmentCard";
import {
  useGetAllAppointments,
  useGetAppointmentHaveTech,
} from "../../../services/appointmentServiceApi";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import SearchBar from "../../../components/SearchBar/Search";
import { useEffect, useState } from "react";
import Appoinment_Progress_Modal from "./Appointment_Progress_Modal";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../../components/Paginations/Pagination";
import { LIST_APPOINTMENTS_MESSAGE } from "../../../constants/messages/Message";
import { NOT_FOUND_ITEMS } from "../../../components/MessageStyled/MessageStyled";
import Appointment_Reassign from "./Appointment_Reassign";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";
import { useAppSelector, type RootState } from "../../../states/store";
import Model3dViewer from "../../Model3d/Model3dViewer";
import ShowButton from "../../../components/Button/ShowButton";
import CreateAppointment from "./CreateAppointment";
import SkeletonCount from "../../../components/Skeletons/Skeleton";
import DayOff from "./DayOff";
import { useGetApplication } from "../../../services/getApplicationApi";

export default function Staff_Appoinments() {
  const queryClient = useQueryClient();
  const name = AppointmentStatusEnum;
  const [sortBy, setSortBy] = useState("Pending");
  const [sortOrder, setSortOrder] = useState("asc");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [currenPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);
  const [isCreating, setIsCreating] = useState(false);
  const isOpen3dModel = useAppSelector(
    (state: RootState) => state.ui.model3dOpen
  );
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailAppointment, setDetailAppointment] =
    useState<StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>>();
  useEffect(() => setCurrentPage(1), [searchValue]);

  const { data: applications } = useGetApplication({});

  const isDayOff = applications?.data?.items?.some((application) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateOff = new Date(application.dateOff);
    dateOff.setHours(0, 0, 0, 0);
    return dateOff.getTime() === today.getTime();
  });

  const { data: appointments, isLoading } = useGetAllAppointments({
    ...((searchValue && { keyWord: searchValue }) || {}),
    status: sortBy,
    sortField: "Appointment_Date",
    ...((beginTime && { beginTime: beginTime }) || {}),
    ...((endTime && { endTime: endTime }) || {}),
    sortOrder: sortOrder,
    pageIndex: currenPage,
    pageSize: 10,
  });

  const { data: appointmentsHaveTech } = useGetAppointmentHaveTech({});
  const checkTechnicianOnleave = (id: number) => {
    return (
      appointmentsHaveTech?.data?.items?.some(
        (appointment) => appointment.id === id
      ) || false
    );
  };

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

  const handleSortByDate = (v: string) => {
    setSortOrder(v);
  };

  const handleOpenProgress = (
    appointment: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
  ) => {
    setSelectedAppointmentId(appointment.id);
    setShowProgressModal(true);
  };

  const handleOpenReassign = (
    appointment: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>
  ) => {
    setSelectedAppointmentId(appointment.id);
    setShowReassignModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setShowProgressModal(false);
    setShowReassignModal(false);
    queryClient.invalidateQueries({
      queryKey: ["Staff Appointments"],
    });
  };

  if (isDayOff) {
    return <DayOff />;
  }

  if (isOpen3dModel) {
    return <Model3dViewer data={selectedAppointmentId || undefined} />;
  }

  if (isCreating) {
    return (
      <PageTransition $isCreating={isCreating}>
        <CreateAppointment onBack={() => setIsCreating(false)} />
      </PageTransition>
    );
  }

  return (
    <PageTransition $isCreating={isCreating}>
      <AppoitmentWrapper>
        <TitleWrapper>
          <h2>Appointments</h2>
          <ButtonGroup>
            <SearchBar
              placeholder="Search appointments..."
              handleSearchValue={setSearchValue}
            />
            <ShowButton
              text="+ CREATE AN APPOINTMENT"
              onclick={() => setIsCreating(true)}
              height="44px"
            />
          </ButtonGroup>
        </TitleWrapper>
        <SortTable
          sortName={sortName}
          setBeginDate={setBeginTime}
          setEndDate={setEndTime}
          setSortBy={setSortBy}
          setSortOrder={handleSortByDate}
          disabled={appointments?.data?.items?.length === 0}
        />
        <SpinnerStyled>
          {isLoading && <SkeletonCount count={5} />}
        </SpinnerStyled>
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
                  setShowDetail={setShowDetail}
                  setDetailAppointment={setDetailAppointment}
                />
              )
            )
          ) : (
            <NOT_FOUND_ITEMS
              icon={<i className="bi bi-exclamation-circle" />}
              message={LIST_APPOINTMENTS_MESSAGE.EMPTY_PENDING(sortBy)}
            />
          )}

          {!isLoading && (
            <Pagination
              pageIndex={currenPage}
              pageSize={10}
              totalItems={appointments?.data?.totalItems || 1}
              totalPage={appointments?.data?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          )}
        </ListAppointmentStyled>
      </AppoitmentWrapper>

      {showProgressModal && selectedAppointmentId && (
        <Appoinment_Progress_Modal
          show={showProgressModal}
          close={handleCloseModal}
          appointmentId={selectedAppointmentId}
        />
      )}

      {showReassignModal && selectedAppointmentId && (
        <Appointment_Reassign
          show={showReassignModal}
          close={handleCloseModal}
          appointmentId={selectedAppointmentId}
        />
      )}

      {showDetail && (
        <Appointment_Detail
          isOpen={showDetail}
          setIsOpen={setShowDetail}
          appointment={detailAppointment ?? undefined}
        />
      )}
    </PageTransition>
  );
}

import {
  ListAppointmentStyled,
  TitleWrapper,
  ButtonGroup,
  SpinnerStyled,
  PageTransition,
  AppoitmentWrapper,
} from "./styles/Staff_Appointments.styled";
import Appointment_Detail from "./Appointment_Detail";
