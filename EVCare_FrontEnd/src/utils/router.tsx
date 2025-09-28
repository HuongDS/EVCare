import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "../components/Layouts/CustomerLayout";
import AdminLayout from "../pages/Admin/AdminLayout";
import TechnicianLayout from "../pages/Technician/TechnicianLayout";
import StaffLayout from "../components/Layouts/StaffLayout";

import HomePage from "../pages/Users/HomePage/HomePage";
import ServiceList from "../pages/Users/Services/ServiceList";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
import OrderDetail from "../pages/Customer/OrderHistory/OrderDetail/OrderDetail";
import Rating from "../pages/Customer/OrderHistory/Rating/Rating";
import Test from "../components/Test";
import PageNotFound from "../components/Layouts/PageNotFound";

import AdminGeneral from "../pages/Admin/AdminGeneral/Admin_General";
import Admin_Logout from "../pages/Admin/AdminLogout/Admin_Logout";
import Admin_Manage_Employee from "../pages/Admin/AdminManageEmployee/Admin_ManageEmployee";
import Admin_Manage_Orders from "../pages/Admin/AdminManageOrders/Admin_ManageOrders";
import Admin_Report from "../pages/Admin/AdminReport/Admin_Report";
import Admin_Part from "../pages/Admin/AdminService&Parts/AdminPart/Admin_Part";
import Admin_Part_Category from "../pages/Admin/AdminService&Parts/AdminPartCategory/Admin_PartCategory";
import Admin_Service from "../pages/Admin/AdminService&Parts/AdminService/Admin_Service";
import Admin_Service_Category from "../pages/Admin/AdminService&Parts/AdminServiceCategory/Admin_ServiceCategory";
import Admin_Appointments from "../pages/Admin/AdminAppointments/Admin_Appointments";
import Admin_Customer_Vehicle from "../pages/Admin/AdminCustomer&Vehicle/Admin_Customer&Vehicle";
import Admin_Help from "../pages/Admin/AdminHelp/Admin_Help";

import StaffGeneral from "../pages/Staff/StaffSections/Staff_General";
import StaffInventory from "../pages/Staff/StaffSections/Staff_Inventory";
import Staff_Appoinments from "../pages/Staff/StaffSections/Staff_Appoinments";

import TechnicianGeneral from "../pages/Technician/TechnicianGeneral/Technician_General";
import TechnicianMyJob from "../pages/Technician/TechnicianMyJob/Technician_MyJob";
import TechnicianSchedule from "../pages/Technician/TechnicianSchedule/Technician_Schedule";
import TechnicianHistory from "../pages/Technician/TechnicianHistory/Technician_History";
import Technician_Application from "../pages/Technician/TechnicianApplication/Technician_Application";
import Technician_Logout from "../pages/Technician/TechnicianLogout/Technician_Logout";
import Technician_Help from "../pages/Technician/TechnicianHelp/Technician_Help";
const router = createBrowserRouter([
  // Customer routes
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "service", element: <ServiceList /> },
      { path: "about", element: <AboutUs /> },
      { path: "contact", element: <ContactUs /> },
      { path: "orderDetail", element: <OrderDetail /> },
      { path: "rating", element: <Rating /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "general", element: <AdminGeneral /> },
      { path: "logout", element: <Admin_Logout /> },
      { path: "manage-employees", element: <Admin_Manage_Employee /> },
      { path: "manage-orders", element: <Admin_Manage_Orders /> },
      { path: "finance-reports", element: <Admin_Report /> },
      { path: "service-categories", element: <Admin_Service_Category /> },
      { path: "services", element: <Admin_Service /> },
      { path: "part-categories", element: <Admin_Part_Category /> },
      { path: "parts", element: <Admin_Part /> },
      { path: "appointments", element: <Admin_Appointments /> },
      { path: "customer-vehicle", element: <Admin_Customer_Vehicle /> },
      { path: "help", element: <Admin_Help /> },
    ],
  },

  // Staff routes
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { path: "general", element: <StaffGeneral /> },
      { path: "inventory", element: <StaffInventory /> },
      { path: "appointments", element: <Staff_Appoinments /> },
    ],
  },

  // Technician routes
  {
    path: "/technician",
    element: <TechnicianLayout />,
    children: [
      { path: "general", element: <TechnicianGeneral /> },
      { path: "my-jobs", element: <TechnicianMyJob /> },
      { path: "schedule", element: <TechnicianSchedule /> },
      { path: "history", element: <TechnicianHistory /> },
      { path: "application", element: <Technician_Application /> },
      { path: "help", element: <Technician_Help /> },
      { path: "logout", element: <Technician_Logout /> },
    ],
  },

  // Test route
  { path: "/test", element: <Test /> },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
