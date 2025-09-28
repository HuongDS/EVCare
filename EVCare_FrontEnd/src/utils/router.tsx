import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "../components/Layouts/CustomerLayout";
import AdminLayout from "../components/Layouts/AdminLayout";
import TechnicianLayout from "../components/Layouts/TechnicianLayout";
import StaffLayout from "../components/Layouts/StaffLayout";

import HomePage from "../pages/Users/HomePage/HomePage";
import ServiceList from "../pages/Users/Services/ServiceList";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
import OrderDetail from "../pages/Customer/OrderHistory/OrderDetail/OrderDetail";
import Rating from "../pages/Customer/OrderHistory/Rating/Rating";

import StaffGeneral from "../pages/Staff/General";
import StaffInventory from "../pages/Staff/Inventory";
import PageNotFound from "../components/Layouts/PageNotFound";
import AdminGeneral from "../pages/Admin/General";
import TechnicianGeneral from "../pages/Technician/General";

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

  // Staff routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [{ path: "general", element: <AdminGeneral /> }],
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      { path: "general", element: <StaffGeneral /> },
      { path: "inventory", element: <StaffInventory /> },
    ],
  },
  {
    path: "/technician",
    element: <TechnicianLayout />,
    children: [{ path: "tasks", element: <TechnicianGeneral /> }],
  },

  { path: "/*", element: <PageNotFound /> },
]);

export default router;
