import { useCallback, useEffect, useMemo, useState } from "react";
import OrderHistorySort from "../../CustomerComponent/AppointmentHistoryFilter";
import { Title } from "./AppointmentList.styled";
import {
  getAppointmentById,
  getCustomerAppointment,
} from "../../../../services/appointmentServiceApi";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import AppointmentDetail from "../AppointmentDetail/AppointmentDetail";
import type { AppointmentViewDetailModel } from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import AppointmentHistoryCard from "./AppointmentHistoryCard";
import { handleError } from "../../../../utils/errorHandler";
import { useNotification } from "../../../../context/useNotification";
import { EmptyState } from "../../../../components/EmptyState";
import { useAppSelector, type RootState } from "../../../../states/store";
import Model3dViewer from "../../../Model3d/Model3dViewer";
export default function OrderList() {
  const sortBy = useMemo(
    () => [
      "Pending",
      "Confirmed",
      "InProgress",
      "ReadyForPickup",
      "Done",
      "Canceled",
    ],
    []
  );
  const [listAppointment, setListAppointment] = useState<
    AppointmentViewDetailModel[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(sortBy[0]);
  const [filteredList, setFilteredList] = useState<
    AppointmentViewDetailModel[]
  >([]);
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loadingModalDetail, setLoadingModalDetail] = useState<number | null>(
    null
  );
  const [data, setData] = useState<AppointmentViewDetailModel>(Object);
  const [model3dData, setModel3dData] = useState<number>();
  const notification = useNotification();
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
      notification.error({
        message: "Error",
        description: "Failed to fetch data",
        showProgress: true,
      });
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
      setListAppointment(response.data?.sort((a, b) => b.id - a.id) ?? []);
      setFilteredList(
        response.data
          ? response.data.filter((a) => a.status === selectedCategory)
          : []
      );
      setIsLoading(false);
    };
    fetchData();
  }, [setFilteredList, selectedCategory]);

  const isOpen3dModel = useAppSelector(
    (state: RootState) => state.ui.model3dOpen
  );

  if (isOpen3dModel) {
    return <Model3dViewer data={model3dData} />;
  } else {
    return (
      <>
        <Title>Appointments History</Title>

        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <SpinnerComponent />
          </div>
        ) : (
          <>
            <OrderHistorySort
              sortName={sortBy}
              onSelectCategory={handleFiltered}
              selectedCategory={selectedCategory}
            />

            {filteredList.length === 0 ? (
              <EmptyState />
            ) : (
              filteredList.map((a) => (
                <AppointmentHistoryCard
                  key={a.id}
                  appointmentId={a.id}
                  onViewAppointmentDetail={onViewAppointmentDetail}
                  data={a}
                  loadingModalDetail={loadingModalDetail}
                  setModel3dData={setModel3dData}
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
}
