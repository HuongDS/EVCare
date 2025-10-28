import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import {
  ManagerWrapper,
  SubTabContainer,
  SubTabButton,
  TabContent,
  TableWrapper,
  StyledTable,
  Th,
  Tr,
  Td,
  ActionButton,
  StatusBadge,
} from "./Admin_Category.styled";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import SpinnerComponent from "../../../components/SpinnerComponent";
import PartCategoryForm from "./PartCategoryForm";
import CategoryEditModal from "./CategoryEditModal";
import DeleteConfirmationModal from "../AdminService&Parts/DeleteConfirmModal";
import type { ServiceCategoryAdminDto } from "../../../models/ServicesModel/ServiceCategoryAdminDto";

const mockApi = {
  getServiceCategories: async (): Promise<ServiceCategoryAdminDto[]> => {
    console.log("FETCH: Vehicle Categories");
    await new Promise((r) => setTimeout(r, 500));
    return [
      { id: 1, name: "SUV", description: "Service 01", isActive: true },
      { id: 2, name: "SEDAN", description: "Service 02", isActive: false },
      { id: 3, name: "COUPE", description: "Service 03", isActive: true },
    ];
  },
  deleteServiceCategory: async (id: number) => {
    console.log("DELETE: Vehicle Category", id);
    await new Promise((r) => setTimeout(r, 500));
  },
};

type SubTab = "view" | "add";

export default function ServiceCategoryAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("view");
  const [categories, setCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const [itemToEdit, setItemToEdit] = useState<ServiceCategoryAdminDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ServiceCategoryAdminDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockApi.getServiceCategories();
      setCategories(data);
    } catch (error) {
      notification.error({ message: "Lỗi", description: "Không thể tải danh mục phụ tùng." });
    }
    setIsLoading(false);
  }, [notification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddSuccess = () => {
    notification.success({ message: "Thành công", description: "Đã thêm danh mục mới." });
    fetchData();
    setActiveSubTab("view");
  };

  const handleOpenEditModal = (category: ServiceCategoryAdminDto) => {
    setItemToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (category: ServiceCategoryAdminDto) => {
    setItemToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await mockApi.deleteServiceCategory(itemToDelete.id);
      notification.success({ message: "Đã xóa", description: `Đã xóa danh mục ${itemToDelete.name}.` });
      fetchData();
    } catch (error) {
      notification.error({ message: "Lỗi", description: (error as Error).message });
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const renderViewTab = () => (
    <TabContent key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <TableWrapper>
          <StyledTable>
            <thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <Tr key={cat.id}>
                  <Td>{cat.name}</Td>
                  <Td>{cat.description}</Td>
                  <Td>
                    <StatusBadge $isActive={cat.isActive}>{cat.isActive ? "Active" : "Deleted"}</StatusBadge>
                  </Td>
                  <Td>
                    <ActionButton onClick={() => handleOpenEditModal(cat)} disabled={!cat.isActive}>
                      <FaPencilAlt />
                    </ActionButton>
                    <ActionButton $isDelete onClick={() => handleOpenDeleteModal(cat)} disabled={!cat.isActive}>
                      <FaTrash />
                    </ActionButton>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      )}
    </TabContent>
  );

  const renderAddTab = () => (
    <TabContent key="add" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <PartCategoryForm onAddSuccess={handleAddSuccess} />
    </TabContent>
  );

  return (
    <>
      <ManagerWrapper>
        <SubTabContainer>
          <SubTabButton $isActive={activeSubTab === "view"} onClick={() => setActiveSubTab("view")}>
            View All
          </SubTabButton>
          <SubTabButton $isActive={activeSubTab === "add"} onClick={() => setActiveSubTab("add")}>
            Add New
          </SubTabButton>
        </SubTabContainer>

        <AnimatePresence mode="wait">{activeSubTab === "view" ? renderViewTab() : renderAddTab()}</AnimatePresence>
      </ManagerWrapper>

      <AnimatePresence>
        {isEditModalOpen && (
          <CategoryEditModal categoryType="Service" itemToEdit={itemToEdit} onClose={() => setIsEditModalOpen(false)} />
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        itemName={itemToDelete?.name || ""}
        itemType="category"
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
