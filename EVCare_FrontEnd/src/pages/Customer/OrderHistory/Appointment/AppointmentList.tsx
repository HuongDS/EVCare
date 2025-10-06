import { useCallback, useEffect, useMemo, useState } from "react";
import OrderHistorySort from "../../CustomerComponent/AppointmentHistoryFilter";
import { Title } from "./AppointmentList.styled";
import { getAppointmentById, getCustomerAppointment } from "../../../../services/appointmentServiceApi";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import AppointmentDetail from "../AppointmentDetail/AppointmentDetail";
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import AppointmentHistoryCard from "./AppointmentHistoryCard";
import { handleError } from "../../../../utils/errorHandler";

export default function OrderList() {
  const sortBy = useMemo(() => ["All", "Pending", "Confirmed", "InProgress", "Done", "Canceled"], []);
  const [listAppointment, setListAppointment] = useState<AppointmentViewDetailModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(sortBy[0]);
  const [filteredList, setFilteredList] = useState<AppointmentViewDetailModel[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loadingModalDetail, setLoadingModalDetail] = useState<number | null>(null);
  const [data, setData] = useState<AppointmentViewDetailModel>(Object);

  const onViewAppointmentDetail = useCallback(async (appointmentId: number) => {
    setLoadingModalDetail(appointmentId);
    setSelectedAppointment(appointmentId);
    try {
      const response = await getAppointmentById(appointmentId);
      if (response.data) {
        setSelectedAppointment(appointmentId);
        setIsOpenModal(true);
        setData(response.data);
      }
    } catch (error) {
      handleError(error);
      alert(error);
    }
    setIsOpenModal(true);
    setLoadingModalDetail(null);
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

  useEffect(() => {
    console.log(filteredList);
  }, [filteredList]);

  return (
    <>
      <Title>Appointments History</Title>
      {isLoading ? (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <SpinnerComponent />
        </div>
      ) : (
        <>
          <OrderHistorySort sortName={sortBy} onSelectCategory={handleFiltered} selectedCategory={selectedCategory} />
          {filteredList.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No orders found.</p>
          ) : (
            filteredList.map((a) => (
              <AppointmentHistoryCard
                appointmentId={a.id}
                onViewAppointmentDetail={onViewAppointmentDetail}
                key={a.id}
                data={a}
                loadingModalDetail={loadingModalDetail}
              />
            ))
          )}
        </>
      )}
      {isOpenModal && selectedAppointment !== 0 && (
        <AppointmentDetail
          data={data}
          appointmentId={selectedAppointment}
          open={isOpenModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
