import { api } from "../api/api";
import type {
  ResponseDto,
  TechnicianAppointmentsDto,
} from "../models/AppointmentsModel/Technician_Appointments_Model";
import { handleError } from "../utils/errorHandler";

/**
 * @param payload { orderId, status }
 */
export async function updateTechnicianWorkingSession(payload: {
  orderId: number;
  status: string;
}) {
  try {
    const response = await api.put<ResponseDto<TechnicianAppointmentsDto>>(
      "/api/TechnicianWorkingSession/my-working-session",
      payload
    );
    console.log("🔎 Update API response:", response.data);
    return response.data.data ?? null;
  } catch (error) {
    handleError(error);
    return null;
  }
}
