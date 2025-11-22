import { AdminGeneralStyled } from "./AdminGeneral.styled.tsx";
import InvoicesTable from "./InvoicesTable.tsx";
import { useEffect, useState } from "react";
import { useAlert } from "../../../context/useAlert.ts";
import { MSG_TITLE } from "../../../constants/messages/Message.ts";
import { getInvoicesWithPagination } from "../../../services/invoicesService.ts";
import HTTP_STATUS from "../../../constants/Code/HttpStatusCode.ts";
import type { InvoiceViewModel } from "../../../models/Invoice/InvoiceViewModel.tsx";
import SpinnerComponent from "../../../components/SpinnerComponent.tsx";
import LazyPerformanceChart from "./LazyPerformanceChart.tsx";

export default function Admin_General() {
  const [listInvoices, setListInvoices] = useState<InvoiceViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getInvoicesWithPagination(10, 1);
        if (response.statusCode !== HTTP_STATUS.OK) {
          throw new Error(response.message);
        }
        setListInvoices(response.data?.items ?? []);
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
      <div className="stats-header">
        <h2>Monthly Overview</h2>
      </div>
      <LazyPerformanceChart></LazyPerformanceChart>
      <InvoicesTable listInvoices={listInvoices}></InvoicesTable>
    </AdminGeneralStyled>
  );
}
