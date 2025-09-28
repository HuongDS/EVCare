import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../src/pages/Users/HomePage/HomePage";
import Layout from "../../src/components/Layouts/CustomerLayout";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
import OrderDetail from "../pages/Customer/OrderHistory/OrderDetail/OrderDetail";
import Rating from "../pages/Customer/OrderHistory/Rating/Rating";
import PageNotFound from "../components/Layouts/PageNotFound";
import Test from "../components/Test";
import ServiceList from "../pages/Users/Services/ServiceList";
import StaffLayout from "../pages/Staff/StaffLayout";
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
  {
    path: "staff",
    element: <StaffLayout />,
    children: [
      {
        path: "appointments",
        element: <Staff_Appoinments />,
      },
    ],
  },
  { path: "/*", element: <PageNotFound /> },
]);

export default router;
