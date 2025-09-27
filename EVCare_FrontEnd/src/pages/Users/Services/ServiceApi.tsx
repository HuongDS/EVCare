import { api } from "../../../api/api";

import { useQuery } from "@tanstack/react-query";

export const ServiceRequest = () => {
  const request = async () => {
    const response = await api.get("api/Service/active");
    return response.data;
  };

  return useQuery({
    queryKey: ["Services"],
    queryFn: request,
  });
};
