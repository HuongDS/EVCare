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
  StatusBadge,
  ActionButton,
} from "./Admin_Category.styled";
import { FaEye, FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import type { Category } from "../../../models/PartModel/PartModel";
import { useNotification } from "../../../context/useNotification";
import SpinnerComponent from "../../../components/SpinnerComponent";
import PartCategoryForm from "./PartCategoryForm";
import CategoryEditModal from "./CategoryEditModal";
import DeleteConfirmationModal from "../AdminService&Parts/DeleteConfirmModal";
import { getPartCategories } from "../../../services/partApi";
import { deletePartCategory } from "../../../services/partCategoryApi";

type SubTab = "view" | "add";

export default function PartCategoryAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("view");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const [itemToEdit, setItemToEdit] = useState<Category | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPartCategories();
      setCategories(data.data?.items ?? []);
    } catch (error) {
      notification.error({ message: "Error", description: (error as Error).message });
    }
    setIsLoading(false);
  }, [notification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddSuccess = () => {
    notification.success({ message: "Add Part Category", description: "Added new Part Category successful." });
    fetchData();
    setActiveSubTab("view");
  };

  const handleOpenEditModal = (category: Category) => {
    setItemToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setItemToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deletePartCategory(itemToDelete.id);
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
                <Tr key={cat.id} $isDeleted={cat.isDeleted}>
                  <Td>{cat.name}</Td>
                  <Td>{cat.description}</Td>
                  <Td>
                    <StatusBadge $isActive={!cat.isDeleted}>{cat.isDeleted ? "Deleted" : "Active"}</StatusBadge>
                  </Td>
                  <Td>
                    <ActionButton onClick={() => handleOpenEditModal(cat)} disabled={cat.isDeleted}>
                      <FaPencilAlt />
                    </ActionButton>
                    <ActionButton $isDelete onClick={() => handleOpenDeleteModal(cat)} disabled={cat.isDeleted}>
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
            <FaEye /> View All
          </SubTabButton>
          <SubTabButton $isActive={activeSubTab === "add"} onClick={() => setActiveSubTab("add")}>
            <FaPlus /> Add New
          </SubTabButton>
        </SubTabContainer>

        <AnimatePresence mode="wait">{activeSubTab === "view" ? renderViewTab() : renderAddTab()}</AnimatePresence>
      </ManagerWrapper>

      <AnimatePresence>
        {isEditModalOpen && (
          <CategoryEditModal categoryType="Part" itemToEdit={itemToEdit} onClose={() => setIsEditModalOpen(false)} />
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
