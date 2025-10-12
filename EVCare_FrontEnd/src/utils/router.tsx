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
import Technician_General from "../pages/Technician/TechnicianGeneral/Technician_General";
import { TechnicianDefaultLayout } from "../pages/Technician/Technician_Component/TechnicianLayout";
import TechnicianOrder from "../pages/Technician/TechnicianOrder/Technician_Order";
import OrderList from "../pages/Customer/OrderHistory/Appointment/AppointmentList";
import ProtectedRoute from "../components/Authorazitons/ProtectedRoute";
import { RoleEnum } from "../models/enums";
import TechnicianOrderLayout from "../pages/Technician/Technician_Component/Technician_OrderLayout";
import { AppointmentList } from "../pages/Technician/TechnicianGeneral/Technician_General.styled";
import UserProfilePage from "../pages/Users/Profile/UserProfilePage";
import Technician_Application from "../pages/Technician/TechnicianApplication/Technician_Application";
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
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
            <UserProfilePage />
          </ProtectedRoute>
        ),
      },

      { path: "test", element: <Test /> },
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
    children: [],
    // children: [{ path: "general", element: <AdminGeneral /> }],
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
      { path: "", element: <Technician_General /> },
      { path: "application", element: <Technician_Application /> },
    ],
  },
  {
    path: "/technician/order",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.TECHNICIAN]}>
        <TechnicianOrderLayout />
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <TechnicianOrder /> }],
  },

  // Test route
  { path: "/test", element: <Test /> },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
