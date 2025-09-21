import { createBrowserRouter } from "react-router-dom";
import HomePage from "../../src/pages/Users/HomePage/HomePage";
import Layout from "../../src/components/Layouts/CustomerLayout";
// import Test from "../components/Test";
import AboutUs from "../pages/Users/AboutUs/AboutUs";
import ContactUs from "../pages/Users/Contact/ContactUs";
import NotFound from "../components/NotFound";
import OrderDetail from "../pages/Customer/OrderHistory/OrderDetail/OrderDetail";
import Rating from "../pages/Customer/OrderHistory/Rating/Rating";
import ServiceList from "../pages/Users/Services/ServiceList";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "service", element: <ServiceList /> },
        { path: "about", element: <AboutUs /> },
        { path: "contact", element: <ContactUs /> },
        { path: "orderDetail", element: <OrderDetail /> },
        { path: "rating", element: <Rating /> },
      ],
    },
    { path: "/*", element: <NotFound /> },
  ],
  { basename: "EVCare" }
);

export default router;
