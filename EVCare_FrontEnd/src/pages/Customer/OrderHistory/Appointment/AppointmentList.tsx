import { useCallback, useEffect, useMemo, useState } from "react";
import type { AppointmentViewModel } from "../../../../models/AppointmentsModel/AppointmentViewModel";
import OrderHistorySort from "../../CustomerComponent/AppointmentHistoryFilter";
import OrderHistoryCard from "./AppointmentHistoryCard";
import { Title } from "./AppointmentList.styled";
import { getCustomerAppointment } from "../../../../services/appointmentServiceApi";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import AppointmentDetail from "../AppointmentDetail/AppointmentDetail";

export default function OrderList() {
  const sortBy = useMemo(() => ["All", "Pending", "Confirmed", "In Progress", "Done", "Canceled"], []);
  const [listAppointment, setListAppointment] = useState<AppointmentViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(sortBy[0]);
  const [filteredList, setFilteredList] = useState<AppointmentViewModel[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const onViewAppointmentDetail = useCallback((appointmentId: number) => {
    setSelectedAppointment(appointmentId);
    setIsOpenModal(true);
  }, []);

  const handleFiltered = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      if (category === sortBy[0]) {
        setFilteredList(listAppointment);
      } else {
        setFilteredList(listAppointment.filter((a) => a.status === category));
      }
    },
    [listAppointment, sortBy]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedAppointment(0);
    setIsOpenModal(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await getCustomerAppointment();
      setListAppointment(response.data ?? []);
      setFilteredList(response.data ?? []);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Title>Appointments History</Title>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <>
          <OrderHistorySort sortName={sortBy} onSelectCategory={handleFiltered} selectedCategory={selectedCategory} />
          {filteredList.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No orders found.</p>
          ) : (
            filteredList.map((a) => (
              <OrderHistoryCard onViewAppointmentDetail={onViewAppointmentDetail} key={a.id} data={a} />
            ))
          )}
        </>
      )}
      {isOpenModal && selectedAppointment != 0 && <AppointmentDetail open={isOpenModal} onClose={handleCloseModal} />}
    </>
  );
}
