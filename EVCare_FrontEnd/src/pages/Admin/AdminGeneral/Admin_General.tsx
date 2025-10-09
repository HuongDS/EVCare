import {AdminGeneralStyled} from "./AdminGeneral.styled.tsx";
import StatsGrid from "./StatsGrid.tsx";
import PerformanceChart from "./PerformanceChart.tsx";
import InvoicesTable from "./InvoicesTable.tsx";

export default function Admin_General() {
    return <AdminGeneralStyled>
        <StatsGrid></StatsGrid>
        <PerformanceChart></PerformanceChart>
        <InvoicesTable></InvoicesTable>
    </AdminGeneralStyled>;
}
