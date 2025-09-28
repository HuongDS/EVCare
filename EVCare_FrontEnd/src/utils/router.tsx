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
import AdminGeneral from "../pages/Admin/TechnicianGeneral/Technician_General";

import StaffGeneral from "../pages/Staff/StaffSections/Staff_General";
import StaffInventory from "../pages/Staff/StaffSections/Staff_Inventory";
import Staff_Appoinments from "../pages/Staff/StaffSections/Staff_Appoinments";

import TechnicianGeneral from "../pages/Technician/TechnicianGeneral/Technician_General";
import TechnicianMyJob from "../pages/Technician/TechnicianMyJob/Technician_MyJob";
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
    children: [{ path: "general", element: <AdminGeneral /> }],
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
      { path: "my-job", element: <TechnicianMyJob /> },
    ],
  },

  // Test route
  { path: "/test", element: <Test /> },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
