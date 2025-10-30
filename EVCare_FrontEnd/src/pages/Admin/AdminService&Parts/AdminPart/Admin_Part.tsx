import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  PageWrapper,
  ContentWrapper,
  Header,
  Title,
  Instruction,
  TabContainer,
  TabButton,
  TabContent,
  FormWrapper,
  FormGrid,
  InputGroup,
  StyledLabel,
  StyledInput,
  StyledSelect,
  PrimaryButton,
  DraggerWrapper,
  TableWrapper,
  StyledTable,
  Th,
  Tr,
  Td,
  PartImage,
  ActionButton,
  EmptyState,
} from "./Admin_Part.styled";
import { FaList, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import UploadImage from "../../../../components/UploadFields/uploadImage";
import DeleteConfirmationModal from "../DeleteConfirmModal";
import SpinnerComponent from "../../../../components/SpinnerComponent";
import { Editor } from "@tinymce/tinymce-react";
import type {
  Category,
  PartDetailDto,
} from "../../../../models/PartModel/PartModel";
import type { NewPartDto } from "../../../../models/PartModel/NewPartDto";
import { useNotification } from "../../../../context/useNotification";
import {
  createPart,
  deletePart,
  getAllParts02,
  getPartCategories,
  updatePart,
} from "../../../../services/partApi";
import { UpdatePartForm } from "./UpdatePartForm";
import { Pagination } from "../../../../components/Paginations/Pagination";
import { ERROR_MESSAGE } from "../../../../constants/messages/Message";
import SearchBar from "../../AdminCustomer&Vehicle/SearchBar";

export default function Admin_Part() {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "update">("list");
  const [parts, setParts] = useState<PartDetailDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const notification = useNotification();
  const [partToEdit, setPartToEdit] = useState<PartDetailDto | null>(null);
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [newPart, setNewPart] = useState<Omit<NewPartDto, "image">>({
    name: "",
    description: "",
    price: 0,
    replacementPrice: 0,
    stock: 0,
    categoryId: 0,
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    part?: PartDetailDto;
  }>({ isOpen: false });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getPartCategories();
        setCategories(categoriesData.data?.items ?? []);
        // if (categoriesData.data?.items?.length > 0) {
        //   setNewPart((prev) => ({ ...prev, categoryId: categoriesArray[0].id }));
        // }
      } catch (error) {
        console.error("Failed to fetch categories", error);
        notification.error({
          message: "Fetch Data",
          description: ERROR_MESSAGE.FETCH_DATA_FAILED,
        });
      }
    };
    fetchCategories();
  }, [notification]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let partsData = null;
        if (search.trim().length > 0) {
          partsData = await getAllParts02({
            PartName: search.trim(),
            PageSize: pageSize,
            PageIndex: pageIndex,
          });
        } else {
          partsData = await getAllParts02({
            PageSize: pageSize,
            PageIndex: pageIndex,
          });
        }
        setParts(partsData.items);
        setTotalPages(partsData.totalPages);
        setTotalItems(partsData.totalItems);
        setPageIndex(partsData.pageIndex);
        setPageSize(partsData.pageSize);
      } catch (error) {
        console.error("Failed to fetch data", error);
        notification.error({
          message: "Fetch Data",
          description: ERROR_MESSAGE.FETCH_DATA_FAILED,
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [search, pageIndex, pageSize, notification]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | string
  ) => {
    if (typeof e === "string") {
      setNewPart((prev) => ({
        ...prev,
        description: e,
      }));
    } else {
      const { name, value } = e.target;
      setNewPart((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "replacementPrice" ||
          name === "stock" ||
          name === "categoryId"
            ? Number(value)
            : value,
      }));
    }
  };

  const onPageChange = (page: number) => {
    setPageIndex(page);
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
    setPageIndex(1);
  };

  const handleFileSubmit = (url: string) => {
    setImageUrl(url);
  };

  const handleFileRemove = () => {
    setImageUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!imageUrl) {
        notification.error({
          message: "Add Part",
          description: "Please upload an image.",
          showProgress: true,
        });
        return;
      }

      if (newPart.name.trim().length <= 0) {
        throw new Error("Please input a part name.");
      }

      if (newPart.description.trim().length <= 0) {
        throw new Error("Please input a part description.");
      }

      if (newPart.price <= 0) {
        throw new Error("Please input a valid part price.");
      }

      if (newPart.replacementPrice <= 0) {
        throw new Error("Please input a valid part replacementPrice.");
      }

      if (newPart.stock <= 0) {
        throw new Error("Please input a valid part stock.");
      }

      const payload: NewPartDto = { ...newPart, image: imageUrl };
      if (
        payload.price === 0 ||
        payload.replacementPrice === 0 ||
        payload.stock === 0
      ) {
        throw new Error(
          "Price, Replacement Price or Stock must be greater than 0 when you adding !"
        );
      }
      const response = await createPart(payload);
      setParts((prev) => [
        ...prev,
        {
          id: response.data,
          name: payload.name,
          quantity: payload.stock,
          description: payload.description ?? "",
          replacementPrice: payload.replacementPrice,
          price: payload.price,
          categoryId: payload.categoryId,
          isDeleted: false,
          imageUrl: payload.image,
        } as PartDetailDto,
      ]);

      notification.success({
        message: "Add Part",
        description: "Product added successfully!",
        showProgress: true,
      });
      setNewPart({
        name: "",
        description: "",
        price: 0,
        replacementPrice: 0,
        stock: 0,
        categoryId: categories[0]?.id || 0,
      });
      setImageUrl("");
      setActiveTab("list");
      if (pageIndex !== 1) setPageIndex(1);
    } catch (error) {
      notification.error({
        message: "Add Part",
        description: (error as Error).message,
        showProgress: true,
      });
    }
  };

  const handleDelete = async (part: PartDetailDto) => {
    setDeleteModal({ isOpen: true, part: part });
  };

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || "N/A";
  };

  const confirmDelete = async () => {
    const partToDelete = deleteModal.part;
    if (!partToDelete) return;
    setDeleteModal({ isOpen: false });

    try {
      await deletePart(partToDelete.id);
      setParts((prev) => prev.filter((p) => p.id !== partToDelete.id));
      notification.info({
        message: "Delete Part",
        description: "Product deleted successfully!",
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: "Delete Part",
        description: (error as Error).message || "Failed to delete product.",
        showProgress: true,
      });
    }
  };

  const handleSelectForUpdate = (part: PartDetailDto) => {
    setPartToEdit(part);
    setActiveTab("update");
  };

  const handleUpdateSubmit = async (id: number, payload: PartDetailDto) => {
    try {
      if (
        payload.price === 0 ||
        payload.replacementPrice === 0 ||
        payload.quantity === 0
      ) {
        throw new Error(
          "Price, Replacement Price or Quantity must be greater than 0 when you updating !"
        );
      }
      await updatePart(id, payload);
      notification.success({
        message: "Update Part",
        description: "Update successfully!",
        showProgress: true,
      });
      setParts((prevParts) =>
        prevParts.map((p) =>
          p.id === id
            ? {
                ...p,
                ...payload,
                quantity: payload.quantity,
                imageUrl: payload.imageUrl,
              }
            : p
        )
      );
      setPartToEdit(null);
      setActiveTab("list");
    } catch (error) {
      notification.error({
        message: "Update Part",
        description: `${(error as Error).message}`,
        showProgress: true,
      });
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <PageWrapper>
      <ContentWrapper>
        <Header>
          <Title>Product Management</Title>
          <Instruction>
            Manage, add new, and delete spare parts in the system.
          </Instruction>
        </Header>

        <SearchBar
          search={search}
          onSearchChange={handleSearch}
          placeHolder="Search by part name..."
        />

        <TabContainer>
          <TabButton
            $isActive={activeTab === "list"}
            onClick={() => setActiveTab("list")}
          >
            <FaList />
            Spare Parts List
          </TabButton>
          <TabButton
            $isActive={activeTab === "add"}
            onClick={() => {
              setActiveTab("add");
              setPartToEdit(null);
            }}
          >
            <FaPlus /> Add New Part
          </TabButton>

          <TabButton $isActive={activeTab === "update"}>
            <FaPencilAlt /> Update Part
          </TabButton>
        </TabContainer>

        <TabContent>
          <AnimatePresence mode="wait">
            {activeTab === "list" && (
              <motion.div
                key="list"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <TableWrapper>
                  <StyledTable>
                    <thead>
                      <Tr>
                        <Th>Image</Th>
                        <Th>Name</Th>
                        <Th>Category</Th>
                        <Th>Price</Th>
                        <Th>Replacement price</Th>
                        <Th>Inventory</Th>
                        <Th>Action</Th>
                      </Tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <Tr>
                          <Td colSpan={7}>
                            <EmptyState>
                              <SpinnerComponent />
                            </EmptyState>
                          </Td>
                        </Tr>
                      ) : parts.length > 0 ? (
                        parts.map(
                          (part) =>
                            !part.isDeleted && (
                              <Tr key={part.id}>
                                <Td>
                                  <PartImage
                                    src={part.imageUrl}
                                    alt={part.name}
                                  />
                                </Td>
                                <Td>{part.name}</Td>
                                <Td>{getCategoryName(part.categoryId)}</Td>
                                <Td>
                                  {part.price.toLocaleString("vi-VN")} VND
                                </Td>
                                <Td>
                                  {part.replacementPrice.toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  VND
                                </Td>
                                <Td>{part.quantity}</Td>
                                <Td>
                                  <ActionButton
                                    onClick={() => handleDelete(part)}
                                  >
                                    <FaTrash />
                                  </ActionButton>
                                  <ActionButton
                                    onClick={() => handleSelectForUpdate(part)}
                                  >
                                    <FaPencilAlt />
                                  </ActionButton>
                                </Td>
                              </Tr>
                            )
                        )
                      ) : (
                        <Tr>
                          <Td colSpan={7}>
                            <EmptyState>
                              {isLoading ? (
                                <SpinnerComponent />
                              ) : (
                                "There are no products."
                              )}
                            </EmptyState>
                          </Td>
                        </Tr>
                      )}
                    </tbody>
                  </StyledTable>
                </TableWrapper>
              </motion.div>
            )}

            {activeTab === "add" && (
              <motion.div
                key="add"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <FormWrapper onSubmit={handleSubmit}>
                  <FormGrid>
                    <div>
                      <InputGroup>
                        <StyledLabel htmlFor="name">
                          Spare PartDetailDto Name
                        </StyledLabel>
                        <StyledInput
                          id="name"
                          name="name"
                          type="text"
                          value={newPart.name}
                          onChange={handleInputChange}
                          required
                        />
                      </InputGroup>

                      <InputGroup>
                        <StyledLabel htmlFor="categoryId">Category</StyledLabel>
                        <StyledSelect
                          id="categoryId"
                          name="categoryId"
                          value={newPart.categoryId}
                          onChange={handleInputChange}
                          required
                        >
                          {categories.length === 0 && (
                            <option>Is Loading...</option>
                          )}
                          {categories.map(
                            (cat) =>
                              !cat.isDeleted && (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              )
                          )}
                        </StyledSelect>
                      </InputGroup>

                      <InputGroup>
                        <StyledLabel htmlFor="description">
                          Description
                        </StyledLabel>
                        <Editor
                          apiKey={import.meta.env.VITE_TINY_KEY}
                          value={newPart.description}
                          init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "table",
                            ],
                            toolbar:
                              "undo redo | formatselect | " +
                              "bold italic underline | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:'Outfit',sans-serif; font-size:15px; line-height:1.6; color: #334155; }",
                            skin: "oxide",
                            content_css: "default",
                          }}
                          onEditorChange={(e) => handleInputChange(e)}
                        />
                      </InputGroup>

                      <FormGrid $isNested={true}>
                        <InputGroup>
                          <StyledLabel htmlFor="price">Price(VND)</StyledLabel>
                          <StyledInput
                            id="price"
                            name="price"
                            type="number"
                            value={newPart.price}
                            onChange={handleInputChange}
                            min={0}
                            required
                          />
                        </InputGroup>
                        <InputGroup>
                          <StyledLabel htmlFor="replacementPrice">
                            Replacement price (VND)
                          </StyledLabel>
                          <StyledInput
                            id="replacementPrice"
                            name="replacementPrice"
                            type="number"
                            value={newPart.replacementPrice}
                            onChange={handleInputChange}
                            min={0}
                            required
                          />
                        </InputGroup>
                      </FormGrid>

                      <InputGroup>
                        <StyledLabel htmlFor="stock">Stocks</StyledLabel>
                        <StyledInput
                          id="stock"
                          name="stock"
                          type="number"
                          value={newPart.stock}
                          onChange={handleInputChange}
                          min={0}
                          required
                        />
                      </InputGroup>
                    </div>

                    <div>
                      <InputGroup>
                        <StyledLabel>Image</StyledLabel>
                        <DraggerWrapper>
                          <UploadImage
                            handleFileSubmit={handleFileSubmit}
                            handleFileRemove={handleFileRemove}
                            imgQuantity={1}
                          />
                        </DraggerWrapper>
                        {imageUrl && (
                          <div
                            style={{ marginTop: "10px", textAlign: "center" }}
                          >
                            <img
                              src={imageUrl}
                              alt="Preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        )}
                      </InputGroup>
                    </div>
                  </FormGrid>

                  <PrimaryButton type="submit">
                    <FaPlus /> Add PartDetailDto
                  </PrimaryButton>
                </FormWrapper>
              </motion.div>
            )}

            {activeTab === "update" && partToEdit && (
              <motion.div
                key={`update-${partToEdit.id}`}
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <UpdatePartForm
                  part={partToEdit}
                  categories={categories}
                  onUpdate={handleUpdateSubmit}
                  onCancel={() => {
                    setPartToEdit(null);
                    setActiveTab("list");
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </TabContent>
      </ContentWrapper>
      <Pagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPage={totalPages}
        onPageChange={onPageChange}
      />
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.part?.name || ""}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
      />
    </PageWrapper>
  );
}
