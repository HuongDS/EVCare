export const ERROR_MESSAGE = {
  TOKEN_HAS_EXPIRED: "Token has expired!",
  LOGIN_FAILED: "Login failed! Try again.",
  SOME_THING_WENT_WRONG: "Something went wrong!",
  OTP_WRONG: "WRONG OTP! PLEASE TRY AGAIN!",
  PASSWORD_AND_CONFIRM_PASSWORD_MUST_BE_SAME: "Mismatch password!",
  INVALID_EMAIL: "Email is not valid.",
  INVALID_PASSWORD:
    "Password is too weak. It must be at least 8 characters, at least 1 letter, 1 number and 1 special character.",
  INVALID_PASSWORD_LOGIN: "Password must be at least 8 characters",
  INVALID_PHONE: "Phone number is not valid.",
  THIS_FIELD_IS_REQUIRED: "This field can not be empty!",
  NO_ACCESS_TOKEN_FROM_REFRESH: "No AccessToken from refresh.",
  FETCH_DATA_FAILED: "Failed to fetch data.",
  CREATE_APPOINTMENT_FAILED: "Failed to create an appointment.",
  CREATE_VEHICLE_FAILED: "Failed to create a vehicle.",
  RESET_PASSWORD_FAILED: "Failed to reset password",
  LICENSE_PLATE_WRONG: "License format was wrong format. Please try again!",
  SERVICES_MUST_NOT_BE_EMPTY: "Please choose at least 1 service!",
  DATE_AND_TIME_CAN_NOT_BE_EMPTY: "Please select a suitable day and time!",
  CAN_NOT_UPDATE_STATUS: "Can't update status. Please try again!",
  CAN_NOT_ASSIGN_TECHNICIANS: "Can't assign the technician. Please try again!",
  THIS_FIELD_NOT_VALID: "This field can not contains all space.",
  FAILED_TO_DELETE_VEHICLE: "Failed to delete vehicle",
  FAILED_TO_ADD_VEHICLE: "Failed to add vehicle",
  FAILED_TO_UPDATE_ACCOUNT: "Failed to Update Account",
  CHANGE_APPOINTMENT_STATUS_FAILED: "Failed to cancel appointment! Try again!",
  COULD_NOT_FIND_SERVICE_INFORMATION: "Could not find service information",
  FAILED_TO_BANNED_ACCOUNT: "Failed to ban this account",
  FAILED_TO_ADD_EMPLOYEE: "Failed to add employee",
  OLD_PASSWORD_INCORRECT: "Old password is incorrect.",
  FAILED_TO_GET_TECHNICIANS: "Failed to get technicians by orderId",
  FAILED_TO_UPDATE_PART: "Failed to update Part!",
  FAILED_TO_DELETE_PART: "Failed while deleting Part",
  FAILED_WHEN_CREATE_SERVICE: "Failed to create service!",
  FAILED_WHEN_DELETE_SERVICE: "Failed to delete service!",
  FAILED_WHEN_UPDATE_SERVICE: "Failed to update service!",
  FAILED_TO_CANCEL_APPOINTMENT: "Failed to cancel appointment",
  FAILED_TO_SCHEDULE_MAINTENANCE: "Failed to schedule maintenance",
};

export const MSG_TITLE = {
  UPDATE_PROFILE: "Update Profile",
  LOGIN: "Login",
  ADD_VEHICLE: "Add Vehicle",
  DELETE_VEHICLE: "Delete Vehicle",
  ADMIN: "Admin",
  FETCH_DATA: "Fetch Data",
  BAN_ACCOUNT: "Ban Account",
  REVIEW: "Review",
  CREATE_APPOINTMENT: "Create Appointment",
  ADD_EMPLOYEE: "Add Employee",
  UPDATE_PASSWORD: "Update Password",
  UPDATE_INVENTORY: "Update Inventory",
  UPLOAD_IMAGE: "Upload Image",
  CANCEL_APPOINTMENT: "Appointment Cancellation",
  PAYMENT: "Payment",
  SCHEDULE: "Schedule Maintenance",
};

export const SUCCESS_MESSAGE = {
  REGISTER_SUCCESS: "OTP verified! Account created.",
  LOGIN_SUCCESS: "Login Successfully!",
  DELETE_VEHICLE_SUCCESS: "Delete Vehicle success",
  UPDATE_ACCOUNT_SUCCESSFULLY: "Update account success",
  ADD_VEHICLE_SUCCESSFULLY: "Add vehivle success",
  SEND_REVIEW_SUCCESS: "Send Review Successfully",
  INVENTORY_UPDATED_SUCCESSFULLY: "Part is updated successfully",
  APPOINTMENT_CANCELLED_SUCCESSFULLY: "Appointment is cancelled successfully",
  PAID_SUCCESSFULLY: "Order is paid successfully",
  SCHEDULE_SUCCESSFULLY: "Schedule maintenance is successful",
};

export const AUTH_FORM_MESSAGE = {
  REGISTER: "Register",
  LOGIN: "Login",
  VERIFY: "Verify OTP",
  WELCOME_BACK: "Welcome Back!",
  FORGOT_PASSWORD: "Forgot Password",
};

//List of services
export const LIST_SERVICES_MESSAGE = {
  EMPTY: "Sorry! No services found for: ",
};

//List of appointment
export const LIST_APPOINTMENTS_MESSAGE = {
  EMPTY_PENDING: (status: string) => `There are currently no ${status} appointments`,
  NO_APPOINTMENT_FOUND: "No appointments found for: ",
};

export const APPOINTMENT_MESSAGE = {
  APPOINTMENT_DOES_NOT_EXIST: "Appointment does not exist!",
  APPOINTMENT_CHECKIN_SUCCESS: "Appointment is checked in successfully",
  APPOINTMENT_CANCEL_SUCCESS: "Appointment is cancelled successfully",
  APPOINTMENT_CANCEL_FAIL: "Failed to cancel this appointment",
  APPOINTMENT_CHECKIN_FAIL: "Oops! You can only check in on customer's appointment day.",
  CREATE_APPOINTMENT_SUCCESS: "Appointment is created successfully",
};

export const FORM_MESSAGES = {
  NAME: "Please enter your name.",
  INVALID_NAME: "Your name is invalid",
};
