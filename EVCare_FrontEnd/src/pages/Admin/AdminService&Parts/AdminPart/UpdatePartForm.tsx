import { useState } from "react";
import type { Category, PartDetailDto } from "../../../../models/PartModel/PartModel";
import {
  ButtonRow,
  CancelButton,
  DraggerWrapper,
  FormGrid,
  FormWrapper,
  InputGroup,
  PrimaryButton,
  StyledInput,
  StyledLabel,
  StyledSelect,
} from "./Admin_Part.styled";
import { Editor } from "@tinymce/tinymce-react";
import UploadImage from "../../../../components/UploadFields/uploadImage";

export const UpdatePartForm = ({
  part,
  categories,
  onUpdate,
  onCancel,
}: {
  part: PartDetailDto | null;
  categories: Category[];
  onUpdate: (id: number, payload: PartDetailDto) => void;
  onCancel: () => void;
}) => {
  if (part == null) return;

  const [formData, setFormData] = useState<PartDetailDto>({
    id: part.id,
    name: part.name,
    description: part.description,
    price: part.price,
    replacementPrice: part.replacementPrice,
    quantity: part.quantity,
    categoryId: part.categoryId,
    isDeleted: part.isDeleted,
    imageUrl: part.imageUrl,
  });

  const [newImageUrl, setNewImageUrl] = useState<string>(part.imageUrl);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | string
  ) => {
    if (typeof e === "string") {
      setFormData((prev) => ({ ...prev, description: e }));
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" || name === "replacementPrice" || name === "stock" || name === "categoryId"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleFileSubmit = (url: string) => {
    setNewImageUrl(url);
  };
  const handleFileRemove = () => {
    setNewImageUrl(part.imageUrl);
  }; // Reset về ảnh gốc

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) {
      alert("Please upload an image.");
      return;
    }
    const payload: PartDetailDto = { ...formData, imageUrl: newImageUrl };
    onUpdate(part.id, payload);
  };

  return (
    <FormWrapper as="form" onSubmit={handleSubmit}>
      <FormGrid>
        <div>
          <InputGroup>
            <StyledLabel htmlFor="update-name">Part's name</StyledLabel>
            <StyledInput
              id="update-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="update-categoryId">Category</StyledLabel>
            <StyledSelect
              id="update-categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </StyledSelect>
          </InputGroup>

          <InputGroup>
            <StyledLabel htmlFor="update-description">Description</StyledLabel>
            <Editor
              apiKey={import.meta.env.VITE_TINY_KEY}
              value={formData.description}
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
              <StyledLabel htmlFor="update-price">Price (VND)</StyledLabel>
              <StyledInput
                id="update-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                min={0}
                required
              />
            </InputGroup>
            <InputGroup>
              <StyledLabel htmlFor="update-replacementPrice">Replacement price (VND)</StyledLabel>
              <StyledInput
                id="update-replacementPrice"
                name="replacementPrice"
                type="number"
                value={formData.replacementPrice}
                onChange={handleInputChange}
                min={0}
                required
              />
            </InputGroup>
          </FormGrid>

          <InputGroup>
            <StyledLabel htmlFor="update-stock">Inventory quantity</StyledLabel>
            <StyledInput
              id="update-stock"
              name="stock"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              min={0}
              required
            />
          </InputGroup>
        </div>

        <div>
          <InputGroup>
            <StyledLabel>Parts Image (Current Image)</StyledLabel>
            <UploadImage handleFileSubmit={handleFileSubmit} handleFileRemove={handleFileRemove} imgQuantity={1} />
            <StyledLabel>Upload new photo (if you want to change)</StyledLabel>
            <DraggerWrapper>
              <UploadImage handleFileSubmit={handleFileSubmit} handleFileRemove={handleFileRemove} imgQuantity={1} />
            </DraggerWrapper>
          </InputGroup>
        </div>
      </FormGrid>

      <ButtonRow>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
        <PrimaryButton type="submit">Save</PrimaryButton>
      </ButtonRow>
    </FormWrapper>
  );
};
