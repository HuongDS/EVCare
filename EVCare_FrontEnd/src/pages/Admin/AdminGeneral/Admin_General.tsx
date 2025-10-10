import { AdminGeneralStyled } from "./AdminGeneral.styled.tsx";
import StatsGrid from "./StatsGrid.tsx";
// import PerformanceChart from "./PerformanceChart.tsx";
import InvoicesTable from "./InvoicesTable.tsx";
import { useEffect, useState } from "react";
import { useAlert } from "../../../context/useAlert.ts";
import { MSG_TITLE } from "../../../constants/messages/Message.ts";
import { getInvoicesWithPagination, getRevenue } from "../../../services/invoicesService.ts";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode.ts";
import {
  countAppointmentsInMonth,
  countAppointmentsWithStatusInMonth,
  countCustomersInMonth,
} from "../../../services/appointmentServiceApi.ts";
import { AppointmentStatusEnum } from "../../../models/enums/AppointmentStatusEnum.tsx";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel.tsx";
import SpinnerComponent from "../../../components/SpinnerComponent.tsx";
import LazyPerformanceChart from "./LazyPerformanceChart.tsx";

export default function Admin_General() {
  // const [revenue, setRevenue] = useState(0);
  // const [numberOfCustomers, setNumberOfCustomers] = useState(0);
  // const [numberOfAppointments, setNumberOfAppointments] = useState(0);
  // const [numberOfCanceledAppointments, setNumberOfCanceledAppointments] = useState(0);
  const [listInvoices, setListInvoices] = useState<InvoiceViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dateNow = new Date();
        const response01 = await getRevenue(dateNow.getFullYear(), dateNow.getMonth() + 1);
        if (response01.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        // setRevenue(response01.data ?? 0);

        const response02 = await countAppointmentsInMonth(dateNow.getFullYear(), dateNow.getMonth());
        if (response02.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        // setNumberOfAppointments(response02.data ?? 0);

        const response03 = await countAppointmentsWithStatusInMonth(
          dateNow.getFullYear(),
          dateNow.getMonth(),
          AppointmentStatusEnum.CANCELED
        );
        if (response03.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        // setNumberOfCanceledAppointments(response03.data ?? 0);

        const response04 = await countCustomersInMonth(dateNow.getFullYear(), dateNow.getMonth());
        if (response04.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        // setNumberOfCustomers(response04.data ?? 0);

        const response05 = await getInvoicesWithPagination(10, 1);
        if (response05.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setListInvoices(response05.data?.items ?? []);
      } catch (ex) {
        showAlert("error", MSG_TITLE.ADMIN, ex as string);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [showAlert]);

  return isLoading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <SpinnerComponent />
    </div>
  ) : (
    <AdminGeneralStyled>
      <StatsGrid></StatsGrid>
      <LazyPerformanceChart></LazyPerformanceChart>
      <InvoicesTable listInvoices={listInvoices}></InvoicesTable>
    </AdminGeneralStyled>
  );
}
