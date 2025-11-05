import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";
import type { ServiceViewFormModel } from "../../../../models/ServicesModel/ServiceViewFormModel";
import { render, screen } from "@testing-library/react";
import ServiceSection from "../ServiceSection";
import userEvent from "@testing-library/user-event";

const mockServices: ServiceViewFormModel[] = [
  {
    id: 999,
    name: "Service999",
  },
  {
    id: 888,
    name: "Service888",
  },
  {
    id: 777,
    name: "Service777",
  },
];

const mockData: ServiceCategoryViewModel[] = [
  {
    name: "Service - Cate01",
    services: [mockServices[0], mockServices[1]],
  },
  {
    name: "Service - Cate02",
    services: [mockServices[2]],
  },
];

const mockFnHandleServiceCategoriesChange = vi.fn();
const mockFnHandleSelectServices = vi.fn();

const mockProps = {
  serviceCategories: mockData,
  handleServiceCategoriesChange: mockFnHandleServiceCategoriesChange,
  handleSelectServices: mockFnHandleSelectServices,
  selectedServices: [111, 222, 333],
};

vi.mock("../MoreInfor.tsx", () => ({
  default: () => {
    return <div data-testid="mock-more-info" />;
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ServiceComponent", () => {
  it("TC01: should render all categories and mock MoreInfo components", () => {
    // ARRANGE
    render(<ServiceSection {...mockProps} />);
    // ACT
    // ASSERT
    expect(screen.getByText("Service - Cate01")).toBeInTheDocument();
    expect(screen.getByText("Service - Cate02")).toBeInTheDocument();
    expect(screen.getAllByTestId("mock-more-info")).toHaveLength(2);
  });

  it("TC02: should render nothing if serviceCategories is empty", () => {
    // ARRANGE
    render(<ServiceSection {...mockProps} serviceCategories={[]} />);
    // ACT
    // ASSERT
    expect(screen.queryByText("Service - Cate01")).not.toBeInTheDocument();
    expect(screen.queryByText("Service - Cate02")).not.toBeInTheDocument();
    expect(screen.queryByTestId("mock-more-info")).not.toBeInTheDocument();
  });

  it("TC03: should call handleServiceCategoriesChange when master checkbox is clicked", async () => {
    // ARRANGE
    const user = userEvent.setup();
    render(<ServiceSection {...mockProps} />);
    const checkboxes = screen.getAllByRole("checkbox");
    // ACT
    await user.click(checkboxes[0]);
    // ASSERT
    expect(mockFnHandleServiceCategoriesChange).toHaveBeenCalledOnce();
    expect(mockFnHandleServiceCategoriesChange).toHaveBeenCalledWith(mockData[0]);
  });

  it("TC04: should not be checked if no services are selected", () => {
    // ARRANGE
    render(<ServiceSection {...mockProps} />);
    // ACT
    const checkboxes = screen.getAllByRole("checkbox");
    // ASSERT
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
  });

  it("TC06: should not be checked if some services are selected", () => {
    // ARRANGE
    render(<ServiceSection {...mockProps} selectedServices={[999]} />);
    // ACT
    const checkboxes = screen.getAllByRole("checkbox");
    // ASSERT
    expect(checkboxes[0]).not.toBeChecked();
  });
});
