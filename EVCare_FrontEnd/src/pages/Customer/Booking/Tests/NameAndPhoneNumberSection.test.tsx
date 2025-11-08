import { describe, it, expect } from "vitest";
import type { AccountViewModel } from "../../../../models/Accounts/accountViewModel";
import { RoleEnum } from "../../../../models/enums";
import { render, screen } from "@testing-library/react";
import NameAndPhoneNumberSection from "../NameAndPhoneNumberSection";

// Test Suit 01
describe("NameAndPhoneNumberSection", () => {
  // TC01: Happy case - Render component with valid account information
  it("TC01: Happy case - Render component with valid account information - should render name and phone number correctly", () => {
    // ARRANGE
    const mockAccountInfor: AccountViewModel = {
      id: 999,
      role: RoleEnum.CUSTOMER,
      email: "test@example.com",
      first_Name: "Unit",
      last_Name: "Test01",
      phone: "0911111111",
    };
    // ACT
    render(<NameAndPhoneNumberSection accountInfor={mockAccountInfor} />);
    // ASSERT
    const nameInput = screen.getByLabelText("Name");
    const phoneInput = screen.getByLabelText("Phone Number");

    expect(nameInput).toHaveValue(mockAccountInfor.first_Name + " " + mockAccountInfor.last_Name);
    expect(phoneInput).toHaveValue(mockAccountInfor.phone);

    expect(nameInput).toBeDisabled();
    expect(phoneInput).toBeDisabled();
  });

  // TC02: When phone is null
  it("TC02: When phone is null - should render 'default' when phone number is null", () => {
    // ARRANGE
    const mockAccountInfor: AccountViewModel = {
      id: 999,
      role: RoleEnum.CUSTOMER,
      email: "test@example.com",
      first_Name: "Unit",
      last_Name: "Test01",
    };
    // ACT
    render(<NameAndPhoneNumberSection accountInfor={mockAccountInfor} />);
    // ASSERT
    const phoneInput = screen.getByLabelText("Phone Number");
    expect(phoneInput).toHaveValue("default");
    expect(phoneInput).toBeDisabled();
  });

  //   TC03: When accountInfor is undefined
  it("TC03: When accountInfor is undefined - should handle undefined accountInfor gracefully", () => {
    // ARRANGE
    // ACT
    render(<NameAndPhoneNumberSection accountInfor={undefined} />);
    // ASSERT
    const nameInput = screen.getByLabelText("Name");
    const phoneInput = screen.getByLabelText("Phone Number");
    expect(nameInput).toHaveValue("Customer");
    expect(phoneInput).toHaveValue("default");
    expect(phoneInput).toBeDisabled();
  });
});
