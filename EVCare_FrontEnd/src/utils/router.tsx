import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminComponents/AdminLayout";
import StaffLayout from "../components/Layouts/StaffLayout";
import HomePage from "../pages/Users/HomePage/HomePage";
import ServiceList from "../pages/Users/ServicesPage/ServiceList";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
// import OrderDetail from "../pages/Customer/OrderHistory/AppointmentDetail/AppointmentDetail";
import Rating from "../pages/Customer/OrderHistory/Rating/Rating";
import Test from "../components/Test";
import PageNotFound from "../components/Layouts/PageNotFound";
import Staff_Inventory from "../pages/Staff/StaffManageInventory/Staff_Inventory";
import Staff_General from "../pages/Staff/StaffGeneralPage/Staff_General";
import Manage_Technicians from "../pages/Staff/StaffManageTechnicians/Manage_Technicians";
import Manage_Customer from "../pages/Staff/StaffManageCustomer/Manage_Customer";
import Staff_Appoinments from "../pages/Staff/StaffManageAppointment/Staff_Appoinments";
import Layout from "../components/Layouts/CustomerLayout";

import { TechnicianDefaultLayout } from "../pages/Technician/Technician_Component/TechnicianLayout";
import OrderList from "../pages/Customer/OrderHistory/Appointment/AppointmentList";
import ProtectedRoute from "../components/Authorazitons/ProtectedRoute";
import { RoleEnum } from "../models/enums";
import TechnicianOrderLayout from "../pages/Technician/Technician_Component/Technician_OrderLayout";
import { AppointmentList } from "../pages/Technician/TechnicianGeneral/Technician_General.styled";
import UserProfilePage from "../pages/Users/Profile/UserProfilePage";

import Admin_General from "../pages/Admin/AdminGeneral/Admin_General.tsx";
import {
  LazyOrder,
  LazyHistory,
  LazySchedule,
  LazyGeneral,
  LazyApplication,
} from "../pages/Technician/Technician_Component/TechnicianLazyPage";
import Admin_Customer_Vehicle from "../pages/Admin/AdminCustomer&Vehicle/Admin_Customer_Vehicle.tsx";
import Review from "../pages/Users/Review/Review.tsx";
import Admin_Manage_Employee from "../pages/Admin/AdminManageEmployee/Admin_ManageEmployee.tsx";
import AddEmployee from "../pages/Admin/AdminManageEmployee/AdminAddEmployee/AddEmployee.tsx";
import { ChatPage } from "../pages/Customer/Chat/ChatPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "service",
        element: <ServiceList />,
      },
      { path: "about", element: <AboutUs /> },
      {
        path: "contact",
        element: <ContactUs />,
      },
      {
        path: "review",
        element: <Review />,
      },
      // CUSTOMER ROUTES
      {
        path: "appointmentHistory",
        element: (
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
            <OrderList />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "appointmentDetail",
            element: <AppointmentList />,
          },
          { path: "rating", element: <Rating /> },
        ],
      },
      {
        path: "account-information",
        element: (
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER, RoleEnum.ADMIN, RoleEnum.TECHNICIAN, RoleEnum.STAFF]}>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },

      { path: "test", element: <Test /> },
      {
        path: "chat-with-staff",
        element: (
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "general", element: <Admin_General /> },
      { path: "manage-customers-and-vehicles", element: <Admin_Customer_Vehicle /> },
      { path: "manage-employees", element: <Admin_Manage_Employee /> },
      { path: "add-employee", element: <AddEmployee /> },
    ],
  },
  // STAFF ROUTES
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.STAFF]}>
        <StaffLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "general", element: <Staff_General /> },
      { path: "inventory", element: <Staff_Inventory /> },
      { path: "technicians", element: <Manage_Technicians /> },
      { path: "customers", element: <Manage_Customer /> },
      { path: "appointments", element: <Staff_Appoinments /> },
      { path: "chat-with-customer", element: <ChatPage /> },
    ],
  },
  // TECHINICIAN ROUTES
  {
    path: "/technician",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.TECHNICIAN]}>
        <TechnicianDefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <LazyGeneral /> },
      { path: "application", element: <LazyApplication /> },
      { path: "history", element: <LazyHistory /> },
      { path: "schedule", element: <LazySchedule /> },
    ],
  },
  {
    path: "/technician/order",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.TECHNICIAN]}>
        <TechnicianOrderLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <LazyOrder /> }],
  },
  // Test route
  { path: "/test", element: <Test /> },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
