import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AppointmentsModel/Technician_Appointments_Model";
import type { TechnicianDetailModel } from "../models/Techinician/TechnicianDetailModel";

export const getTechnicianDetail = async (technicianId: number): Promise<TechnicianDetailModel> => {
  const { data } = await api.get<ResponseDto<TechnicianDetailModel>>(`/api/Technician/detail/${technicianId}`);
  return data.data!;
};

export const useTechnicianDetailQuery = (technicianId?: number) => {
  return useQuery({
    queryKey: ["technicianDetail", technicianId],
    queryFn: () => getTechnicianDetail(technicianId!),
    enabled: !!technicianId,
    staleTime: 5 * 60 * 1000,
  });
};
