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
        public const string REFRESH_TOKEN_SUCCESS = "Token refreshed successfully.";
        public const string OTP_HAS_BEEN_SENT = "OTP sent. Please verify.";
        public const string OTP_INVALID = "OTP is invalid.";

        // Account
        public const string ACCOUNT_NOT_FOUND = "Account not found.";
        public const string ACCOUNT_EXISTS = "Account already exists.";
        public const string REGISTER_SUCCESS = "Register successfully.";
        public const string LOGIN_SUCCESS = "Login successfully.";
        public const string LOGIN_FAILED = "Login failed. Invalid email or password.";
        public const string LOGOUT_SUCCESS = "Logout successfully.";
        public const string PASSWORD_MISMATCH = "Password and Confirm Password do not match.";
        public const string PASSWORD_RESET_SUCCESS = "Password reset successfully.";

        // Parttern
        public const string WEAK_PASSWORD = "Password is too weak. It must be at least 8 characters, at least 1 letter, 1 number and 1 special character.";
        public const string INVALID_EMAIL = "Email is not valid.";
        public const string INVALID_PHONE = "Phone number is not valid.";

        // Appointment
        public const string APPOINTMENT_NOT_FOUND = "Appointment not found.";

        // Order 
        public const string ORDER_NOT_FOUND = "Order not found.";
        public const string ORDER_CREATED_SUCCESS = "Order created successfully.";
    }
}
