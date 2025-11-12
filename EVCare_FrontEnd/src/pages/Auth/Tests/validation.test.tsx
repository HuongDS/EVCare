import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isValidPassword,
  isValidSignUpPassword,
  isValidConfirmPassword,
  isValidPhoneNumber,
} from "../validation/validation";

describe("Validation Functions", () => {
  describe("isValidEmail", () => {
    it("TC01: should return true for a valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });

    it("TC02: should return false for an invalid email", () => {
      expect(isValidEmail("test.com")).toBe(false);
      expect(isValidEmail("test@domain")).toBe(false);
    });

    it("TC03: should return false for an empty string", () => {
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidPassword (Login)", () => {
    it("TC01: should return true for a valid login password", () => {
      expect(isValidPassword("any-valid-password")).toBe(true);
    });

    it("TC02: should return false for an invalid login password (too short)", () => {
      expect(isValidPassword("123")).toBe(false);
    });

    it("TC03: should return false for an empty string", () => {
      expect(isValidPassword("")).toBe(false);
    });
  });

  describe("isValidSignUpPassword (Sign Up)", () => {
    it("TC01: should return true for a strong password", () => {
      expect(isValidSignUpPassword("ValidPass123!")).toBe(true);
    });

    it("TC02: should return false for a weak password (missing criteria)", () => {
      expect(isValidSignUpPassword("ValidPass123")).toBe(false);
      expect(isValidSignUpPassword("ValidPass!")).toBe(false);
      expect(isValidSignUpPassword("Val1!")).toBe(false);
    });

    it("TC03: should return false for an empty string", () => {
      expect(isValidSignUpPassword("")).toBe(false);
    });
  });

  describe("isValidConfirmPassword", () => {
    it("TC01: should return true when passwords match", () => {
      expect(isValidConfirmPassword("pass123", "pass123")).toBe(true);
    });

    it("TC02: should return false when passwords do not match", () => {
      expect(isValidConfirmPassword("pass123", "pass456")).toBe(false);
    });

    it("TC03: should return false for case-sensitive mismatches", () => {
      expect(isValidConfirmPassword("Pass123", "pass123")).toBe(false);
    });
  });

  describe("isValidPhoneNumber", () => {
    it("TC01: should return true for a valid phone number", () => {
      expect(isValidPhoneNumber("0909123456")).toBe(true);
      expect(isValidPhoneNumber("0358123456")).toBe(true);
    });

    it("TC02: should return false for an invalid phone number", () => {
      expect(isValidPhoneNumber("123456")).toBe(false);
      expect(isValidPhoneNumber("0909123")).toBe(false);
      expect(isValidPhoneNumber("09091234567")).toBe(false);
      expect(isValidPhoneNumber("0909abcde")).toBe(false);
      expect(isValidPhoneNumber("0909 123 456")).toBe(false);
    });

    it("TC03: should return false for an empty string", () => {
      expect(isValidPhoneNumber("")).toBe(false);
    });
  });
});
