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
import CategoryEditModal from "./CategoryEditModal";
import DeleteConfirmationModal from "../AdminService&Parts/DeleteConfirmModal";
import type { ServiceCategoryAdminDto } from "../../../models/ServicesModel/ServiceCategoryAdminDto";
import { deleteServiceCategory, getAllServiceCategories } from "../../../services/serviceServicesApi";
import ServiceCategoryForm from "./ServiceCategoryForm";

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
      const data = await getAllServiceCategories();
      setCategories(data?.data?.items ?? []);
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsLoading(false);
  }, [notification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddOrUpdateSuccess = () => {
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
      await deleteServiceCategory(itemToDelete.id);
      notification.success({ message: "Deleted", description: `Deleted category ${itemToDelete.name}.` });
      fetchData();
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
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
      <ServiceCategoryForm onAddSuccess={handleAddOrUpdateSuccess} />
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
          <CategoryEditModal
            handleAddOrUpdateSuccess={handleAddOrUpdateSuccess}
            categoryType="Service"
            itemToEdit={itemToEdit}
            onClose={() => setIsEditModalOpen(false)}
          />
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
