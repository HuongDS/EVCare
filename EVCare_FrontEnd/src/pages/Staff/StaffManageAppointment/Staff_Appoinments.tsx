import SortTable from "../StaffComponents/SortTable";
import {AppointmentStatusEnum} from "../../../models/enums";
import styled from "styled-components";
import AppointmentCard from "../StaffComponents/AppointmentCard";
import {useGetAllAppointments} from "../../../services/appointmentServiceApi";
import type {StaffAppointmentsDto} from "../../../models/AppointmentsModel/Staff_Appointments_Model";
import SearchBar from "../../../components/SearchBar/Search";
import SpinnerComponent from "../../../components/SpinnerComponent";
import {useState} from "react";
import Appoinment_Progress_Modal from "./Appoinment_Progress_Modal";
import {useQueryClient} from "@tanstack/react-query";

const AppoitmentWrapper = styled.div``;

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

export default function Staff_Appoinments() {
    const queryClient = useQueryClient();
    const name = AppointmentStatusEnum;
    const [selectedAppointment, setSelectedAppointment] =
        useState<StaffAppointmentsDto | null>(null);

    const handleOpenModal = (appointment: StaffAppointmentsDto) => {
        setSelectedAppointment(appointment);
    };

    const handleCloseModal = () => {
        setSelectedAppointment(null);
        queryClient.invalidateQueries({
            queryKey: ["Staff Appointments"],
        });
    };

    const {data: appointments, isLoading} = useGetAllAppointments({
        status: " Confirmed",
    });

    if (isLoading) return <SpinnerComponent/>;
    const sortName = [
        "All",
        name.PENDING,
        name.CHECKED_IN,
        name.CONFIRMED,
        name.IN_PROGRESS,
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
                        handleSearchValue={() => 1}
                    />
                </TitleWrapper>
                <SortTable sortName={sortName}/>
                <div>
                    {appointments?.data?.items?.map((item: StaffAppointmentsDto) => (
                        <AppointmentCard
                            key={item.id}
                            data={item}
                            onOpenProgress={() => handleOpenModal(item)}
                        />
                    ))}
                </div>
            </AppoitmentWrapper>
            {selectedAppointment && (
                <Appoinment_Progress_Modal
                    show={!!selectedAppointment}
                    close={handleCloseModal}
                    data={selectedAppointment}
                />
            )}
        </>
    );
}
