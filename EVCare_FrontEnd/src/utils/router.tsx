import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminComponents/AdminLayout";
import StaffLayout from "../components/Layouts/StaffLayout";
import HomePage from "../pages/Users/HomePage/HomePage";
import ServiceList from "../pages/Users/ServicesPage/ServiceList";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
import OrderDetail from "../pages/Customer/OrderHistory/OrderDetail/OrderDetail";
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
import TechnicianLayout from "../pages/Technician/Technician_Component/TechnicianLayout";
import TechnicianOrder from "../pages/Technician/TechnicianOrder/Technician_Order";
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
        path: "orderDetail",
        element: <OrderDetail />,
      },
      { path: "rating", element: <Rating /> },
      { path: "test", element: <Test /> },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    // children: [{ path: "general", element: <AdminGeneral /> }],
  },

  // Staff routes
  {
    path: "staff",
    element: <StaffLayout />,
    children: [
      { path: "general", element: <Staff_General /> },
      { path: "inventory", element: <Staff_Inventory /> },
      { path: "technicians", element: <Manage_Technicians /> },
      { path: "customers", element: <Manage_Customer /> },
      { path: "appointments", element: <Staff_Appoinments /> },
    ],
  },

  // Technician routes
  {
    path: "/technician",
    element: <TechnicianLayout />,
    children: [
      { path: "general", element: <Technician_General /> },
      { path: "order", element: <TechnicianOrder /> },
    ],
  },

  // Test route
  { path: "/test", element: <Test /> },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
