import { AdminGeneralStyled } from "./AdminGeneral.styled.tsx";
import StatsGrid from "./StatsGrid.tsx";
import PerformanceChart from "./PerformanceChart.tsx";
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
import type { InvoiceQueryDto } from "../../../models/Invoice/InvoiceQueryDto.tsx";

export default function Admin_General() {
  const [revenue, setRevenue] = useState(0);
  const [numberOfCustomers, setNumberOfCustomers] = useState(0);
  const [numberOfAppointments, setNumberOfAppointments] = useState(0);
  const [numberOfCanceledAppointments, setNumberOfCanceledAppointments] = useState(0);
  const [listInvoices, setListInvoices] = useState<InvoiceViewModel[]>([]);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dateNow = new Date();
        const response01 = await getRevenue(dateNow.getFullYear(), dateNow.getMonth());
        if (response01.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setRevenue(response01.data ?? 0);

        const response02 = await countAppointmentsInMonth(dateNow.getFullYear(), dateNow.getMonth());
        if (response02.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setNumberOfAppointments(response02.data ?? 0);

        const response03 = await countAppointmentsWithStatusInMonth(
          dateNow.getFullYear(),
          dateNow.getMonth(),
          AppointmentStatusEnum.CANCELED
        );
        if (response03.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setNumberOfCanceledAppointments(response03.data ?? 0);

        const response04 = await countCustomersInMonth(dateNow.getFullYear(), dateNow.getMonth());
        if (response04.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setNumberOfCustomers(response04.data ?? 0);

        const newInvoiceDto: InvoiceQueryDto = {
          pageSize: 10,
          pageIndex: 1,
        };
        const response05 = await getInvoicesWithPagination(newInvoiceDto);
        if (response05.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response01.message);
        }
        setListInvoices(response05.data?.items ?? []);
      } catch (ex) {
        showAlert("error", MSG_TITLE.ADMIN, ex as string);
      }
    };
    fetchData();
  }, [showAlert]);

  return (
    <AdminGeneralStyled>
      <StatsGrid
        revenue={revenue}
        numberOfCustomers={numberOfCustomers}
        numberOfAppointments={numberOfAppointments}
        numberOfCanceledAppointments={numberOfCanceledAppointments}
      ></StatsGrid>
      <PerformanceChart></PerformanceChart>
      <InvoicesTable listInvoices={listInvoices}></InvoicesTable>
    </AdminGeneralStyled>
  );
}
