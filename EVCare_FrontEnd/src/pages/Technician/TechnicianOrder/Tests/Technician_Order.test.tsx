import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TechnicianOrder from "../Technician_Order";
import { useTechnicianOrder } from "../../../../hooks/useTechnicianOrder";
import ProductCard from "../../Technician_Component/ProductCard";
import CartModal from "../../Technician_Component/CartModal";
import ProductModal from "../../Technician_Component/ProductModal";

// --- Mock modules ---
vi.mock("../../../../hooks/useTechnicianOrder", () => ({
  useTechnicianOrder: vi.fn(),
}));

vi.mock("../../Technician_Component/ProductCard", () => ({
  default: vi.fn((props: any) => (
    <div
      data-testid="mock-product-card"
      data-id={props.part?.id}
      onClick={props.onClick}
    />
  )),
}));

vi.mock("../../Technician_Component/CartModal", () => ({
  default: vi.fn((props: any) => (
    <div data-testid="mock-cart-modal" data-cart-length={props.cart.length} />
  )),
}));

vi.mock("../../Technician_Component/ProductModal", () => ({
  default: vi.fn(() => <div data-testid="mock-product-modal" />),
}));

vi.mock("../../Technician_Component/SearchBar", () => ({
  default: vi.fn((props: any) => (
    <input
      data-testid="mock-search-bar"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  )),
}));

vi.mock("@mui/material", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mui/material")>();
  return {
    ...actual,
    Pagination: vi.fn((props: any) => (
      <div
        data-testid="mock-pagination"
        data-count={props.count}
        onClick={() => props.onChange?.({ target: {} } as any, 2)}
      />
    )),
    PaginationItem: vi.fn(() => null),
  };
});

vi.mock("@mui/icons-material/ArrowBack", () => ({ default: vi.fn() }));
vi.mock("@mui/icons-material/ArrowForward", () => ({ default: vi.fn() }));

// --- Mock data ---
const mockUseTechnicianOrder = vi.mocked(useTechnicianOrder);

const mockSetOpen = vi.fn();
const mockSetCartOpen = vi.fn();
const mockSetPage = vi.fn();
const mockSetSearchQuery = vi.fn();
const mockSetSelectedPart = vi.fn();
const mockHandleBack = vi.fn();
const mockHandleAddToCart = vi.fn();

const MOCK_PART = {
  id: 10,
  name: "Test Part",
  price: 100,
  quantity: 5,
  isDeleted: false,
  isAvailable: true,
} as any;

const MOCK_DELETED_PART_DATA = {
  ...MOCK_PART,
  id: 99,
  isDeleted: true,
  quantity: 0,
};

const mockHookData = {
  cart: [{ part: MOCK_PART, quantity: 1 }],
  displayParts: [MOCK_PART, { ...MOCK_PART, id: 11 }],
  page: 1,
  totalPages: 3,
  searchQuery: "initial",
  isLoading: false,
  isSending: false,
  pageSize: 10,
  open: false,
  selectedPart: null,
  cartOpen: false,
  setCart: vi.fn(),
  setOpen: mockSetOpen,
  setCartOpen: mockSetCartOpen,
  setPage: mockSetPage,
  setSearchQuery: mockSetSearchQuery,
  setSelectedPart: mockSetSelectedPart,
  handleBack: mockHandleBack,
  handleAddToCart: mockHandleAddToCart,
  handleRemoveFromCart: vi.fn(),
  handleSendCart: vi.fn(),
};

// --- Tests ---
describe("TechnicianOrder Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTechnicianOrder.mockReturnValue(mockHookData as any);
  });

  it("TC01: render layout, search bar, product cards, pagination", () => {
    // ARRANGE + ACT
    render(<TechnicianOrder />);

    // ASSERT
    expect(screen.getByText("Technician Order")).toBeInTheDocument();
    expect(screen.getByText("Open Cart (1)")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-product-card")).toHaveLength(2);
    expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
  });

  it("TC02: SearchBar onChange", () => {
    // ARRANGE
    render(<TechnicianOrder />);
    const input = screen.getByTestId("mock-search-bar");

    // ACT
    fireEvent.change(input, { target: { value: "oil" } });

    // ASSERT
    expect(mockSetSearchQuery).toHaveBeenCalledWith("oil");
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });

  it("TC03: ProductCard click valid", () => {
    // ARRANGE
    render(<TechnicianOrder />);
    const cardProps = vi.mocked(ProductCard).mock.calls?.[0]?.[0];

    // ACT
    cardProps?.onClick?.();

    // ASSERT
    expect(mockSetSelectedPart).toHaveBeenCalledWith(MOCK_PART);
    expect(mockSetOpen).toHaveBeenCalledWith(true);
  });

  it("TC04: Back button & Open Cart", () => {
    // ARRANGE
    render(<TechnicianOrder />);

    // ACT
    fireEvent.click(screen.getByText("← Back"));
    fireEvent.click(screen.getByText("Open Cart (1)"));

    // ASSERT
    expect(mockHandleBack).toHaveBeenCalledTimes(1);
    expect(mockSetCartOpen).toHaveBeenCalledWith(true);
  });

  it("TC05: ProductCard click with deleted part", () => {
    // ARRANGE
    mockUseTechnicianOrder.mockReturnValue({
      ...mockHookData,
      displayParts: [MOCK_DELETED_PART_DATA],
    } as any);
    render(<TechnicianOrder />);
    const cardProps = vi.mocked(ProductCard).mock.calls?.[0]?.[0];

    // ACT
    cardProps?.onClick?.();

    // ASSERT
    expect(mockSetSelectedPart).not.toHaveBeenCalled();
    expect(mockSetOpen).not.toHaveBeenCalled();
  });

  it("TC06: ProductModal & CartModal onClose", () => {
    // ARRANGE
    mockUseTechnicianOrder.mockReturnValue({
      ...mockHookData,
      open: true,
      cartOpen: true,
    } as any);
    render(<TechnicianOrder />);
    const productModalProps = vi.mocked(ProductModal).mock.calls?.[0]?.[0];
    const cartModalProps = vi.mocked(CartModal).mock.calls?.[0]?.[0];

    // ACT
    productModalProps?.onClose?.();
    cartModalProps?.onClose?.();

    // ASSERT
    expect(mockSetOpen).toHaveBeenCalledWith(false);
    expect(mockSetCartOpen).toHaveBeenCalledWith(false);
  });

  it("TC07: Pagination onChange", () => {
    // ARRANGE
    render(<TechnicianOrder />);
    const pagination = screen.getByTestId("mock-pagination");

    // ACT
    fireEvent.click(pagination);

    // ASSERT
    expect(mockSetPage).toHaveBeenCalledWith(2);
  });

  it("TC08: CartModal onQuantityChange", () => {
    // ARRANGE
    const mockSetCart = vi.fn();
    mockUseTechnicianOrder.mockReturnValue({
      ...mockHookData,
      setCart: mockSetCart,
    } as any);
    render(<TechnicianOrder />);
    const cartModalProps = vi.mocked(CartModal).mock.calls?.[0]?.[0];
    const initialCart = [{ part: MOCK_PART, quantity: 10 }];

    // ACT
    cartModalProps?.onQuantityChange?.(10, 15);

    // ASSERT
    expect(mockSetCart).toHaveBeenCalledTimes(1);
    const updateCallback = mockSetCart.mock.calls[0][0];
    const newCart = updateCallback(initialCart);
    expect(newCart[0].quantity).toBe(15);
  });
});
