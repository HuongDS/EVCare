import { LazyPerformance } from "./LazyPerformance";

export const LazyOrder = LazyPerformance(
  () => import("../TechnicianOrder/Technician_Order")
);
export const LazyHistory = LazyPerformance(
  () => import("../TechnicianHistory/Technician_History")
);
export const LazySchedule = LazyPerformance(
  () => import("../TechnicianSchedule/Technician_Schedule")
);
export const LazyGeneral = LazyPerformance(
  () => import("../TechnicianGeneral/Technician_General")
);
export const LazyApplication = LazyPerformance(
  () => import("../TechnicianApplication/Technician_Application")
);
