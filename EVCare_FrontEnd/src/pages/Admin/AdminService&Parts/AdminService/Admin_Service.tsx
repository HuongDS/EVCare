import { useState, useEffect, useCallback, Fragment } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PageWrapper,
  ContentWrapper,
  Header,
  Title,
  Instruction,
  Toolbar,
  AddButton,
  TableWrapper,
  StyledTable,
  Th,
  Tr,
  Td,
  ActionButton,
  UpdateButton,
  EmptyState,
  ExpandButton,
  ExpandedContentCell,
  PartGallery,
  PartCard,
  PartImageWrapper,
  PartName,
} from "./Admin_Service.styled";
import { Pagination } from "../../../../components/Paginations/Pagination";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import { useNotification } from "../../../../context/useNotification";
import { FaPlus, FaPencilAlt, FaTrash, FaChevronUp, FaChevronDown } from "react-icons/fa";
import ServiceFormModal from "./ServiceFormModal";
import DeleteConfirmationModal from "../DeleteConfirmModal";
import SearchBar from "../../AdminCustomer&Vehicle/SearchBar";
import type { Service } from "../../../../models/ServicesModel/ServiceViewModel";
import {
  deleteService,
  getAllServiceCategories,
  getAllServicesWithPagination,
} from "../../../../services/serviceServicesApi";
import type { ServiceCategoryAdminDto } from "../../../../models/ServicesModel/ServiceCategoryAdminDto";

export default function Admin_Service() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    service?: Service;
  }>({ isOpen: false });
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryAdminDto[]>([]);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let response = null;
      if (search.length > 0) {
        response = await getAllServicesWithPagination({
          keyword: search,
          pageIndex: pageIndex,
          pageSize: pageSize,
        });
      } else {
        response = await getAllServicesWithPagination({
          pageIndex: pageIndex,
          pageSize: pageSize,
        });
      }
      setServices(response?.data?.items || []);
      setTotalPages(response?.data?.totalPages ?? totalPages);
      setTotalItems(response?.data?.totalItems ?? totalItems);
      setPageIndex(response?.data?.pageIndex ?? pageIndex);
      setPageSize(response?.data?.pageSize ?? pageSize);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Could not load services.",
      });
    }
    setIsLoading(false);
  }, [search, pageIndex, pageSize, notification]);

  useEffect(() => {
    fetchData();
    fetchServiceCategories();
  }, [fetchData]);

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setPageIndex(1);
  };

  const onPageChange = (page: number) => {
    setPageIndex(page);
  };

  const handleOpenAddModal = () => {
    setServiceToEdit(null);
    setIsFormModalOpen(true);
  };

  const fetchServiceCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllServiceCategories();
      setServiceCategories(response?.data?.items || []);
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Could not load services categories",
        showProgress: true,
      });
    }
    setIsLoading(false);
  }, []);

  const handleOpenEditModal = (service: Service) => {
    setServiceToEdit(service);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (service: Service) => {
    setDeleteModal({ isOpen: true, service: service });
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setServiceToEdit(null);
  };

  const handleFormSuccess = () => {
    handleCloseFormModal();
    fetchData();
  };

  const confirmDelete = async () => {
    const serviceToDelete = deleteModal.service;
    if (!serviceToDelete) return;

    setDeleteModal({ isOpen: false });

    try {
      await deleteService({ serviceId: serviceToDelete.id });
      notification.success({
        message: "Success",
        description: "Service marked as deleted.",
        showProgress: true,
      });
      setServices((prev) => prev.map((s) => (s.id === serviceToDelete.id ? { ...s, isDeleted: true } : s)));
    } catch (error) {
      console.error("Failed to delete service", error);
      notification.error({
        message: "Error",
        description: "Could not delete service.",
        showProgress: true,
      });
    }
  };

  const handleToggleExpand = (serviceId: number) => {
    setExpandedRowId((prevId) => (prevId === serviceId ? null : serviceId));
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Service Management</Title>
          <Instruction>Add, edit, and manage all available services.</Instruction>
        </Header>

        <Toolbar>
          <SearchBar
            search={search}
            onSearchChange={handleSearch}
            placeHolder="Search by service name or description..."
          />
          <AddButton onClick={handleOpenAddModal}>
            <FaPlus /> Add New Service
          </AddButton>
        </Toolbar>

        <TableWrapper>
          <StyledTable>
            <thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>Est. Duration (Hours)</Th>
                <Th>Parts</Th>
                <Th>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {isLoading ? (
                <Tr>
                  <Td colSpan={5}>
                    <EmptyState>
                      <SpinnerComponent />
                    </EmptyState>
                  </Td>
                </Tr>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <Fragment key={service.id}>
                    <Tr key={service.id} $isDeleted={service.isDeleted}>
                      <Td>{service.name}</Td>
                      <Td>{service.description}</Td>
                      <Td>{service.duration.toFixed(1)} hrs</Td>
                      <Td>
                        <ExpandButton onClick={() => handleToggleExpand(service.id)}>
                          {expandedRowId === service.id ? <FaChevronUp /> : <FaChevronDown />}
                        </ExpandButton>
                      </Td>
                      <Td>
                        <UpdateButton onClick={() => handleOpenEditModal(service)} disabled={service.isDeleted}>
                          <FaPencilAlt /> Edit
                        </UpdateButton>
                        {!service.isDeleted && (
                          <ActionButton onClick={() => handleOpenDeleteModal(service)}>
                            <FaTrash /> Delete
                          </ActionButton>
                        )}
                      </Td>
                    </Tr>
                    <AnimatePresence>
                      {expandedRowId === service.id && (
                        <Tr
                          className="expanded-row"
                          as={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ExpandedContentCell colSpan={5}>
                            <h4>Associated Parts</h4>
                            <PartGallery>
                              {service.parts && service.parts.length > 0 ? (
                                service.parts.map((part) => (
                                  <PartCard key={part.id}>
                                    <PartImageWrapper>
                                      {" "}
                                      <img src={part.image} alt={part.name} />
                                    </PartImageWrapper>
                                    <PartName>{part.name}</PartName>
                                  </PartCard>
                                ))
                              ) : (
                                <p>No parts associated with this service.</p>
                              )}
                            </PartGallery>
                          </ExpandedContentCell>
                        </Tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                ))
              ) : (
                <Tr>
                  <Td colSpan={5}>
                    <EmptyState>No services found.</EmptyState>
                  </Td>
                </Tr>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>

        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalItems={totalItems}
          totalPage={totalPages}
          onPageChange={onPageChange}
        />
      </ContentWrapper>

      <AnimatePresence>
        {isFormModalOpen && (
          <ServiceFormModal
            isOpen={isFormModalOpen}
            onClose={handleCloseFormModal}
            onSuccess={handleFormSuccess}
            serviceToEdit={serviceToEdit}
            serviceCategories={serviceCategories}
          />
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.service?.name || ""}
        itemType="service"
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
      />
    </PageWrapper>
  );
}
