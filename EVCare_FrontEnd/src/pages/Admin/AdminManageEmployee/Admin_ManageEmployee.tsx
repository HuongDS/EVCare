import React, { useEffect, useState } from "react";
import FilterBar from "../AdminManageEmployee/FilterBar";
import EmployeeCard from "../AdminManageEmployee/EmployeeCard";
import BanModal from "../AdminManageEmployee/BanModal";
import type { EmployeeViewModel } from "../../../models/Employee/EmployeeViewModel";
import { EmployeeStatusEnum, RoleEnum } from "../../../models/enums";
import {
  ContentWrapper,
  EmployeesGrid,
  EmptyState,
  Header,
  Instruction,
  PageWrapper,
  Title,
} from "./Admin_ManageEmployee.styled";
import { banAccount, getAllEmployee } from "../../../services/adminService";
import { useAlert } from "../../../context/useAlert";
import { MSG_TITLE } from "../../../constants/messages/Message";
import { Pagination } from "../../../components/Paginations/Pagination";
import SpinnerComponent from "../../../components/SpinnerComponent";

const Admin_Manage_Employee: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeViewModel[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleEnum>(RoleEnum.STAFF);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusEnum>(EmployeeStatusEnum.All);
  const [banModal, setBanModal] = useState<{ open: boolean; emp?: EmployeeViewModel }>({
    open: false,
  });
  const { showAlert } = useAlert();
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBan = (id: number) => {
    const emp = employees.find((e) => e.accountId === id);
    setBanModal({ open: true, emp });
  };

  const confirmBan = async () => {
    setBanModal({ open: false });
    if (banModal.emp?.accountId) {
      try {
        await banAccount(banModal.emp?.accountId);
        showAlert("success", MSG_TITLE.BAN_ACCOUNT, "Banned successfully");
        setEmployees((prev) =>
          prev.map((e) => (e.accountId === banModal.emp?.accountId ? { ...e, isBanned: true } : e))
        );
      } catch (error) {
        showAlert("error", MSG_TITLE.BAN_ACCOUNT, (error as Error).message);
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await getAllEmployee(search, roleFilter, statusFilter, 6, pageIndex);
        setPageIndex(response.data?.pageIndex ?? 1);
        setTotalPages(response.data?.totalPages ?? 1);
        setTotalItems(response.data?.totalItems ?? 0);
        setEmployees(response.data?.items ?? []);
      } catch (error) {
        showAlert("error", MSG_TITLE.FETCH_DATA, (error as Error).message);
      }
    };
    fetchData();
    setIsLoading(false);
  }, [search, roleFilter, statusFilter, pageIndex]);
  return isLoading ? (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
      <SpinnerComponent />
    </div>
  ) : (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Employee Management</Title>
          <Instruction>Filter and manage all employees in your system.</Instruction>
        </Header>

        <FilterBar
          search={search}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onRoleChange={setRoleFilter}
          onStatusChange={setStatusFilter}
        />

        <EmployeesGrid>
          {employees.length > 0 ? (
            employees.map((e) => <EmployeeCard key={e.accountId} emp={e} onBan={handleBan} />)
          ) : (
            <EmptyState>No employees found matching your filters</EmptyState>
          )}
        </EmployeesGrid>
      </ContentWrapper>

      <BanModal
        isOpen={banModal.open}
        employeeName={banModal.emp?.fullName}
        onClose={() => setBanModal({ open: false })}
        onConfirm={confirmBan}
      />

      <Pagination
        pageIndex={pageIndex}
        pageSize={6}
        totalItems={totalItems}
        totalPage={totalPages}
        onPageChange={setPageIndex}
      />
    </PageWrapper>
  );
};

export default Admin_Manage_Employee;
