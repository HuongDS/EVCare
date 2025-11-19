import React, { useCallback, useEffect, useState } from "react";
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
import { banAccount, getAllEmployee, updateTechnicianSkills } from "../../../services/adminService";
import { useAlert } from "../../../context/useAlert";
import { MSG_TITLE } from "../../../constants/messages/Message";
import { Pagination } from "../../../components/Paginations/Pagination";
import SpinnerComponent from "../../../components/SpinnerComponent";
import EditTechnicianModal from "./EditTechnicianModal";
import UpdateSkillModal from "./UpdateSkillModal";
import { useNotification } from "../../../context/useNotification";

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<EmployeeViewModel | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notification = useNotification();

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

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllEmployee(search, roleFilter, statusFilter, 6, pageIndex);
      setTotalPages(response.data?.totalPages ?? 1);
      setTotalItems(response.data?.totalItems ?? 0);
      setEmployees(response.data?.items ?? []);
    } catch (error) {
      showAlert("error", MSG_TITLE.FETCH_DATA, (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [search, roleFilter, statusFilter, pageIndex]);

  const handleOpenEditModal = (emp: EmployeeViewModel) => {
    setEmployeeToEdit(emp);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEmployeeToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleOpenSkillModal = (emp: EmployeeViewModel) => {
    setEmployeeToEdit(emp);
    setIsSkillModalOpen(true);
  };

  const handleEditTechnicianSkills = async (technician: EmployeeViewModel, selectedSkillIds: number[]) => {
    if (!technician) return;
    setIsSubmitting(true);
    try {
      if (!technician.technicianId) return;
      const response = await updateTechnicianSkills({
        technicianId: technician.technicianId,
        serviceIds: selectedSkillIds,
      });
      setIsSubmitting(false);
      fetchData();
      setIsSkillModalOpen(false);
      notification.success({
        message: response.message,
      });
    } catch (error) {
      notification.error({
        message: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            employees.map((e) => (
              <EmployeeCard
                onUpdateSkill={() => handleOpenSkillModal(e)}
                onEdit={handleOpenEditModal}
                key={e.accountId}
                emp={e}
                onBan={handleBan}
              />
            ))
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

      <EditTechnicianModal isOpen={isEditModalOpen} onClose={handleCloseEditModal} employee={employeeToEdit} />

      <Pagination
        pageIndex={pageIndex}
        pageSize={6}
        totalItems={totalItems}
        totalPage={totalPages}
        onPageChange={setPageIndex}
      />

      <UpdateSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        technician={employeeToEdit}
        handleEditTechnicianSkills={handleEditTechnicianSkills}
        isSubmitting={isSubmitting}
      />
    </PageWrapper>
  );
};

export default Admin_Manage_Employee;
