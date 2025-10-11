using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Infrastructures
{
    public static class Message
    {
        public const string INVALID_TOKEN = "Invalid token.";
        public const string EXPIRED_TOKEN = "Token has expired.";
        public const string UNAUTHORIZED = "Unauthorized access.";
        public const string FORBIDDEN = "Forbidden access.";
        public const string INTERNAL_SERVER_ERROR = "Internal server error.";
        public const string BAD_REQUEST = "Bad request.";
        public const string NOT_FOUND = "Resource not found.";
        public const string OTP_HAS_BEEN_SENT = "OTP sent. Please verify.";
        public const string OTP_INVALID = "OTP is invalid.";
        public const string SOMETHING_WENT_WRONG = "Something went wrong. Please try again later.";

        // RefreshToken
        public const string REFRESH_TOKEN_SUCCESS = "Token refreshed successfully.";
        public const string REFRESH_TOKEN_EXPIRED = "Refresh token has expired. Please login again.";
        public const string REFRESH_TOKEN_NOT_PROVIDED = "No refresh token provided.";

        // Account
        public const string ACCOUNT_NOT_FOUND = "Account not found.";
        public const string ACCOUNT_EXISTS = "Account already exists.";
        public const string REGISTER_SUCCESS = "Register successfully.";
        public const string LOGIN_SUCCESS = "Login successfully.";
        public const string LOGIN_FAILED = "Login failed. Invalid email or password.";
        public const string LOGOUT_SUCCESS = "Logout successfully.";
        public const string PASSWORD_MISMATCH = "Password and Confirm Password do not match.";
        public const string PASSWORD_RESET_SUCCESS = "Password reset successfully.";
        public const string GET_ACCOUNT_SUCCESS = "Get Acccount successfully";
        public const string UPDATE_ACCOUNT_SUCCESS = "Update Account successfully";
        public const string PHONE_EXISTS = "Phone number already exists.";
        public const string EMAIL_EXISTS = "Email already exists.";

        // Parttern
        public const string WEAK_PASSWORD = "Password is too weak. It must be at least 8 characters, at least 1 letter, 1 number and 1 special character.";
        public const string INVALID_EMAIL = "Email is not valid.";
        public const string INVALID_PHONE = "Phone number is not valid.";
        public const string THIS_FIELD_IS_REQUIRED = "This field is required.";

        // Appointment
        public const string APPOINTMENT_NOT_FOUND = "Appointment not found.";
        public const string APPOINTMENT_CREATED_SUCCESS = "Appointment created successfully.";
        public const string APPOINTMENT_STATUS_UPDATED_SUCCESS = "Appointment status updated successfully.";
        public const string APPOINTMENTS_FETCHED_SUCCESS = "Appointments fetched successfully.";
        public const string APPOINTMENT_UPDATED_SUCCESS = "Appointment updated successfully.";
        public const string APPOINTMENT_CANNOT_BE_CONFIRMED = "Appointment cannot be confirmed. Please check the appointment details.";
        public const string APPOINTMENT_CONFIRMED_SUCCESS = "Appointment confirmed successfully.";
        public const string APPOINTMENT_CANNOT_BE_CANCELED = "Appointment cannot be canceled. Please check the appointment details.";
        public const string APPOINTMENT_GET_SUCCESS = "Appointment get successfully";
        public const string APPOINTMENT_CANCEL_SUCCESS = "Appointment cancel successfully";

        // Order 
        public const string ORDER_NOT_FOUND = "Order not found.";
        public const string ORDER_CREATED_SUCCESS = "Order created successfully.";
        public const string ORDER_STATUS_UPDATED_SUCCESS = "Order status updated successfully.";
        public const string ORDER_GET_SUCCESS = "Order get successfully.";

        // OrderParts
        public const string ORDER_PARTS_ADDED_SUCCESS = "Parts added to order successfully.";
        public const string ORDER_PARTS_UPDATE_SUCCESS = "Parts update to order successfully.";

        // Parts
        public const string PART_NOT_FOUND = "Part not found.";

        // Application
        public const string APPLICATION_NOT_FOUND = "Application not found.";
        public const string APPLICATION_SENT_SUCCESS = "Application sent successfully.";
        public const string APPLICATION_ALREADY_EXISTS = "You have already sent an application for this date off.";

        // Slots
        public const string CHECK_SLOT_SUCCESS = "Check slots successfully";
        public const string SLOT_FULL = "All slots are full. Please try again later.";
        public const string ASSIGNED_TECHNICIAN_SUCCESSFUL = "Technician assigned to order successfully.";

        // Alert
        public const string ALERTS_FETCHED_SUCCESS = "Alerts fetched successfully.";
        public const string ALERT_MARKED_AS_READ_SUCCESS = "Alert marked as read successfully.";

        //Service Category
        public const string SERVICE_CATEGORY_GET_SUCCESSSFULLY = "Get Service category successfully";

        //Service
        public const string GET_SERVICE_SUCCESSFULLY = "Get service successfully";
        public const string ADD_SERVICE_SUCCESSFULLY = "Add a service successfully";
        public const string ADD_SERVICE_FALL = "Add a service fall";
        public const string DELETE_SUCCESSFULLY = "Delete a service successfully";
        public const string DELETE_FAIL = "Delete a service fail";
        public const string UPDATE_FAIL = "Update a service fail";
        public const string UPDATE_SUCCESS = "Update a service success";
        //Service Center
        public const string SERVICE_CENTER_GET_SUCCESSFULLY = "Get service center successfully";
        public const string SERVICE_CENTER_UPDATE_SUCCESSFULLY = "Update service center successfully";

        //Vehicle
        public const string VEHICLE_UPDATE_SUCCESSFULLY = "Update vehicle successfully";
        public const string VEHICLE_EXISTS = "Vehicle already exists.";
        public const string VEHICLE_NOT_FOUND = "Vehicle not found.";
        public const string VEHICLE_DELETE_SUCCESSFULLY = "Delete vehicle successfully";

        //Part
        public const string PART_GET_SUCCESSFULLY = "Get parts successfully";
        //Part category
        public const string PART_Category_GET_SUCCESSFULLY = "Get part categories successfully";

        //Customer
        public const string CUSTOMER_GET_SUCCESSFULLY = "Get customer successfully";

        //Technician
        public const string GET_TECHNICIAN_SUCCESSFULLY = "Get technician successfully";
        public const string UPDATE_SUCCESSFULLY = "Update successfully";

        //AI
        public const string GET_AI_SUCCESSFULLY = "Get AI successfully";
        public static string ADD_TECHNICIAN_SUCCESSFULLY = "Add technician successfully";

        // Invoice
        public const string INVOICE_CREATED_SUCCESS = "Invoice created successfully.";
        public const string INVOICE_GET_SUCCESS = "Invoice get successfully.";
        public const string INVOICE_PAYMENT_SUCCESS = "Invoice payment processed successfully.";
        public const string GET_REVENUE_SUCCESS = "Get revenue successfully.";
        public const string GET_RECENT_INVOICES_SUCCESS = "Get recent invoices successfully.";

        public static string APPLICATION_GET_SUCCESS = "Application get successfully";
    }
}
