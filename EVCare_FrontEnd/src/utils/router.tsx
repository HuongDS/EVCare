import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Customers/HomePage/HomePage";
import Layout from "../components/Layout/Layout";
import Test from "../components/Test";
import AboutUs from "../pages/Customers/AboutUs/AboutUs";
import ContactUs from "../pages/Customers/Contact/ContactUs";
import NotFound from "../components/NotFound";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "service", element: <Test /> },
        { path: "about", element: <AboutUs /> },
        { path: "contact", element: <ContactUs /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ],
  { basename: "EVCare" }
);

export default router;
