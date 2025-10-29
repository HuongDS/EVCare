import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import SpinnerComponent from "../components/SpinnerComponent";
import ProtectedRoute from "../components/Authorazitons/ProtectedRoute";
import { RoleEnum } from "../models/enums";
const Layout = lazy(() => import("../components/Layouts/CustomerLayout"));
const AdminLayout = lazy(
  () => import("../pages/Admin/AdminComponents/AdminLayout")
);
const StaffLayout = lazy(() => import("../components/Layouts/StaffLayout"));
const TechnicianDefaultLayout = lazy(
  () => import("../pages/Technician/Technician_Component/TechnicianLayout")
);
const TechnicianOrderLayout = lazy(
  () =>
    import("../pages/Technician/Technician_Component/Technician_OrderLayout")
);
const HomePage = lazy(() => import("../pages/Users/HomePage/HomePage"));
const ServiceList = lazy(
  () => import("../pages/Users/ServicesPage/ServiceList")
);
const AboutUs = lazy(() => import("../pages/Users/AboutUs/AboutUs"));
const ContactUs = lazy(() => import("../pages/Users/Contact/ContactUs"));
const OrderList = lazy(
  () => import("../pages/Customer/OrderHistory/Appointment/AppointmentList")
);
const Rating = lazy(
  () => import("../pages/Customer/OrderHistory/Rating/Rating")
);
const Test = lazy(() => import("../components/Test"));
const PageNotFound = lazy(() => import("../components/Layouts/PageNotFound"));
const UserProfilePage = lazy(
  () => import("../pages/Users/Profile/UserProfilePage")
);
const Review = lazy(() => import("../pages/Users/Review/Review"));
const PolicyPage = lazy(() => import("../pages/Users/PolicyPage/Policy"));
const ChatPage = lazy(() =>
  import("../pages/Customer/Chat/ChatPage").then((module) => ({
    default: module.ChatPage,
  }))
);
const Admin_General = lazy(() => import("../pages/Admin/AdminGeneral/Admin_General"));
const Admin_Customer_Vehicle = lazy(() => import("../pages/Admin/AdminCustomer&Vehicle/Admin_Customer_Vehicle"));
const Admin_Manage_Employee = lazy(() => import("../pages/Admin/AdminManageEmployee/Admin_ManageEmployee"));
const AddEmployee = lazy(() => import("../pages/Admin/AdminManageEmployee/AdminAddEmployee/AddEmployee"));
const Admin_Part = lazy(() => import("../pages/Admin/AdminService&Parts/AdminPart/Admin_Part"));
const Admin_Service = lazy(() => import("../pages/Admin/AdminService&Parts/AdminService/Admin_Service"));
const Staff_Inventory = lazy(() => import("../pages/Staff/StaffManageInventory/Staff_Inventory"));
const Staff_General = lazy(() => import("../pages/Staff/StaffGeneralPage/Staff_General"));
const Manage_Technicians = lazy(() => import("../pages/Staff/StaffManageTechnicians/Manage_Technicians"));
const Manage_Customer = lazy(() => import("../pages/Staff/StaffManageCustomer/Manage_Customer"));
const Staff_Appoinments = lazy(() => import("../pages/Staff/StaffManageAppointment/Staff_Appoinments"));
const AdminServiceCenter = lazy(() => import("../pages/Admin/AdminServiceCenter/AdminServiceCenter"));
const Admin_Category = lazy(() => import("../pages/Admin/AdminCategory/Admin_Category"));
const StaffChatPage = lazy(() =>
  import("../pages/Customer/Chat/StaffChatPage").then((module) => ({ default: module.StaffChatPage }))
);

import {
  LazyOrder,
  LazyHistory,
  LazySchedule,
  LazyGeneral,
  LazyApplication,
  LazyMyJob,
} from "../pages/Technician/Technician_Component/TechnicianLazyPage";
import { AppointmentList } from "../pages/Technician/TechnicianGeneral/Technician_General.styled";

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Suspense fallback={<SpinnerComponent />}>{children}</Suspense>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SuspenseWrapper>
        <Layout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "service",
        element: (
          <SuspenseWrapper>
            <ServiceList />
          </SuspenseWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <SuspenseWrapper>
            <AboutUs />
          </SuspenseWrapper>
        ),
      },
      {
        path: "policy",
        element: (
          <SuspenseWrapper>
            <PolicyPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "contact",
        element: (
          <SuspenseWrapper>
            <ContactUs />
          </SuspenseWrapper>
        ),
      },
      {
        path: "review",
        element: (
          <SuspenseWrapper>
            <Review />
          </SuspenseWrapper>
        ),
      },
      // CUSTOMER ROUTES
      {
        path: "appointmentHistory",
        element: (
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
            <SuspenseWrapper>
              <OrderList />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
        children: [
          {
            path: "appointmentDetail",
            element: (
              <SuspenseWrapper>
                <AppointmentList />
              </SuspenseWrapper>
            ),
          },
          {
            path: "rating",
            element: (
              <SuspenseWrapper>
                <Rating />
              </SuspenseWrapper>
            ),
          },
        ],
      },
      {
        path: "account-information",
        element: (
          <ProtectedRoute
            allowedRoles={[
              RoleEnum.CUSTOMER,
              RoleEnum.ADMIN,
              RoleEnum.TECHNICIAN,
              RoleEnum.STAFF,
            ]}
          >
            <SuspenseWrapper>
              <UserProfilePage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },

      {
        path: "test",
        element: (
          <SuspenseWrapper>
            <Test />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat-with-staff",
        element: (
          <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
            <SuspenseWrapper>
              <ChatPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
    ],
  },
  // ADMIN ROUTES
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
        <SuspenseWrapper>
          <AdminLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "general",
        element: (
          <SuspenseWrapper>
            <Admin_General />
          </SuspenseWrapper>
        ),
      },
      {
        path: "manage-customers-and-vehicles",
        element: (
          <SuspenseWrapper>
            <Admin_Customer_Vehicle />
          </SuspenseWrapper>
        ),
      },
      {
        path: "manage-employees",
        element: (
          <SuspenseWrapper>
            <Admin_Manage_Employee />
          </SuspenseWrapper>
        ),
      },
      {
        path: "add-employee",
        element: (
          <SuspenseWrapper>
            <AddEmployee />
          </SuspenseWrapper>
        ),
      },
      {
        path: "manage-parts",
        element: (
          <SuspenseWrapper>
            <Admin_Part />
          </SuspenseWrapper>
        ),
      },
      {
        path: "manage-services",
        element: (
          <SuspenseWrapper>
            <Admin_Service />
          </SuspenseWrapper>
        ),
      },
      {
        path: "applications",
        element: (
          <SuspenseWrapper>
            <Admin_Applications />
          </SuspenseWrapper>
        ),
      },
      {
        path: "categories",
        element: (
          <SuspenseWrapper>
            <Admin_Category />
          </SuspenseWrapper>
        ),
      },
      {
        path: "center-information",
        element: (
          <SuspenseWrapper>
            <AdminServiceCenter />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // STAFF ROUTES
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.STAFF]}>
        <SuspenseWrapper>
          <StaffLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="general" replace /> },
      {
        path: "general",
        element: (
          <SuspenseWrapper>
            <Staff_General />
          </SuspenseWrapper>
        ),
      },
      {
        path: "inventory",
        element: (
          <SuspenseWrapper>
            <Staff_Inventory />
          </SuspenseWrapper>
        ),
      },
      {
        path: "technicians",
        element: (
          <SuspenseWrapper>
            <Manage_Technicians />
          </SuspenseWrapper>
        ),
      },
      {
        path: "customers",
        element: (
          <SuspenseWrapper>
            <Manage_Customer />
          </SuspenseWrapper>
        ),
      },
      {
        path: "appointments",
        element: (
          <SuspenseWrapper>
            <Staff_Appoinments />
          </SuspenseWrapper>
        ),
      },
      {
        path: "chat-with-customer",
        element: (
          <SuspenseWrapper>
            <StaffChatPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // TECHINICIAN ROUTES
  {
    path: "/technician",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.TECHNICIAN]}>
        <SuspenseWrapper>
          <TechnicianDefaultLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <LazyGeneral /> },
      { path: "application", element: <LazyApplication /> },
      { path: "history", element: <LazyHistory /> },
      { path: "schedule", element: <LazySchedule /> },
      { path: "my-jobs", element: <LazyMyJob /> },
    ],
  },
  {
    path: "/technician/order",
    element: (
      <ProtectedRoute allowedRoles={[RoleEnum.TECHNICIAN]}>
        <SuspenseWrapper>
          <TechnicianOrderLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [{ path: "", element: <LazyOrder /> }],
  },
  // Test route
  {
    path: "/test",
    element: (
      <SuspenseWrapper>
        <Test />
      </SuspenseWrapper>
    ),
  },
  {
    path: "/*",
    element: (
      <SuspenseWrapper>
        <PageNotFound />
      </SuspenseWrapper>
    ),
  },
]);

export default router;
