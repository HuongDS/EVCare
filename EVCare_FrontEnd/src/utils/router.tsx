import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Customers/HomePage/HomePage";
import Layout from "../components/Layout/Layout";
import Test from "../components/Test";
import AboutUs from "../pages/Customers/AboutUs/AboutUs";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        { path: "/service", element: <Test /> },
        { path: "/about", element: <AboutUs /> },
      ],
    },
  ],
  { basename: "EVCare" }
);

export default router;
