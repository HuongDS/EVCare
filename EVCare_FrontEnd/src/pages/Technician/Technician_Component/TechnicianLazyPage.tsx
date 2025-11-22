import { LazyPerformance } from "./LazyPerformance";

export const LazyHistory = LazyPerformance(() => import("../TechnicianHistory/Technician_History"));
export const LazyGeneral = LazyPerformance(() => import("../TechnicianGeneral/Technician_General"));
export const LazyApplication = LazyPerformance(() => import("../TechnicianApplication/Technician_Application"));
export const LazyMyJob = LazyPerformance(() => import("../TechnicianMyJob/Technician_MyJob"));
