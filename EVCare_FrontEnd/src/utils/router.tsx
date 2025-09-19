import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Customers/HomePage/HomePage";
import Layout from "../components/Layout/Layout";
import Test from "../components/Test";

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
      ],
    },
    { path: "/*", element: <NotFound /> },
  ],
  { basename: "EVCare" }
);

export default router;
