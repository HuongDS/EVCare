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
} from "./Admin_Category.styled";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { useNotification } from "../../../context/useNotification";
import SpinnerComponent from "../../../components/SpinnerComponent";
import DeleteConfirmationModal from "../AdminService&Parts/DeleteConfirmModal";
import type {
  VehicleCategoryViewDto,
  VehicleCategoryWithScaleViewDto,
} from "../../../models/VehicleModels/vehicleCategoryViewDto";
import VehicleCategoryForm from "./VehicleCategoryForm"; // <-- UPDATED
import VehicleCategoryEditModal from "./VehicleCategoryEditModal"; // <-- UPDATED
import { deleteVehicleCategory, getVehicleCategories } from "../../../services/vehicleServicesApi";
import { ERROR_MESSAGE } from "../../../constants/messages/Message";

type SubTab = "view" | "add";

export default function VehicleCategoryAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("view");
  const [categories, setCategories] = useState<VehicleCategoryWithScaleViewDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const [itemToEdit, setItemToEdit] = useState<VehicleCategoryWithScaleViewDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<VehicleCategoryViewDto | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getVehicleCategories();
      setCategories(data?.data ?? []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: ERROR_MESSAGE.FETCH_DATA_FAILED,
        showProgress: true,
      });
    }
    setIsLoading(false);
  }, [notification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddSuccess = () => {
    fetchData();
    setActiveSubTab("view");
  };

  const handleEditSuccess = () => {
    fetchData();
    setIsEditModalOpen(false);
    setItemToEdit(null);
  };

  const handleOpenEditModal = (category: VehicleCategoryWithScaleViewDto) => {
    setItemToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (category: VehicleCategoryWithScaleViewDto) => {
    setItemToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteVehicleCategory(itemToDelete.id);
      notification.success({
        message: "Deleted",
        description: `Category ${itemToDelete.name} deleted.`,
        showProgress: true,
      });
      fetchData();
    } catch (error) {
      notification.error({
        message: "Error",
        description: (error as Error).message,
        showProgress: true,
      });
    }
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const renderViewTab = () => (
    <TabContent key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <TableWrapper $maxWidth="600px">
          <StyledTable>
            <thead>
              <Tr>
                <Th>Name</Th>
                <Th style={{ width: "120px" }}>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <Tr key={cat.id}>
                  <Td>{cat.name}</Td>
                  <Td>
                    <ActionButton onClick={() => handleOpenEditModal(cat)}>
                      <FaPencilAlt />
                    </ActionButton>
                    <ActionButton $isDelete onClick={() => handleOpenDeleteModal(cat)}>
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
      <VehicleCategoryForm onAddSuccess={handleAddSuccess} />
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
          <VehicleCategoryEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
            itemToEdit={itemToEdit}
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
