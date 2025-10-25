import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { TechnicianCusViewModel } from "../models/Techinician/TechnicianCusViewModel";
import { useQuery } from "@tanstack/react-query";

export const useGetTechniciansByOrderId = (data: number) => {
  return useQuery({
    queryKey: ["orderId", data],
    queryFn: async () => {
      const response = await api.get<ResponseDto<TechnicianCusViewModel[]>>(
        "/api/Technician/technicians-by-orderId/" + `${data}`
      );
      return response.data;
    },
    enabled: !!data,
  });
};
