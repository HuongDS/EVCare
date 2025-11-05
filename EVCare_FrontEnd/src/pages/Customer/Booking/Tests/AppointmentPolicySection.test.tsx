import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AppointmentPolicySection from "../AppointmentPolicySection";
import userEvent from "@testing-library/user-event";

const mockHandleSetVisible = vi.fn();

const mockProps = {
  visible: false,
  handleSetVisible: mockHandleSetVisible,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AppointmentPolicySection", () => {
  it("TC01: Test render", () => {
    // ARRANGE
    render(<AppointmentPolicySection {...mockProps} />);
    // ACT
    // ASSERT
    expect(screen.getByText("Please agree with our policy to continue, View Appointment Policies")).toBeInTheDocument();
  });

  it("TC02: should render policies if visible are false", () => {
    // ARRANGE
    render(<AppointmentPolicySection {...mockProps} />);
    // ACT
    // ASSERT
    expect(screen.queryByText("1. Appointment Confirmation")).not.toBeInTheDocument();
  });

  it("TC03: should not render policies if visible are true", () => {
    // ARRANGE
    render(<AppointmentPolicySection {...mockProps} visible={true} />);
    // ACT
    // ASSERT
    expect(screen.getByText("Hide Appointment Policies")).toBeInTheDocument();
    expect(screen.getByText("1. Appointment Confirmation")).toBeInTheDocument();
  });

  it("TC04: should call handleSetVisible when user clicked to the link", async () => {
    // ARRANGE
    render(<AppointmentPolicySection {...mockProps} />);
    const user = userEvent.setup();
    const link = screen.getByText(/Please agree with our policy to continue, View Appointment Policies/i);
    // ACT
    await user.click(link);
    // ASSERT
    expect(mockHandleSetVisible).toHaveBeenCalledOnce();
  });
});
