import { EMAIL_REGEX } from "../../../constants/regexs/EmailRegex";
import {
  PASSWORD_REGEX,
  PASSWORD_REGEX_LOGIN,
} from "../../../constants/regexs/PasswordRegex";
import { PHONE_NUMBER_REGEX } from "../../../constants/regexs/PhoneNumberRegex";

export const isValidEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
};

export const isValidPassword = (password: string) => {
  return PASSWORD_REGEX_LOGIN.test(password);
};

export const isValidSignUpPassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};

export const isValidConfirmPassword = (
  confirmPassword: string,
  password: string
) => {
  return confirmPassword === password;
};

export const isValidPhoneNumber = (phoneNumber: string) => {
  return PHONE_NUMBER_REGEX.test(phoneNumber);
};
