import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import type {
  PartDamagedModel,
  DataDto,
  PartCategoryViewModel,
  ResponseDto,
} from "../models/Model3d/Model3d";
import { handleError } from "../utils/errorHandler";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";

export const useGetPartDamage = (appointmentId: number) => {
  return useQuery({
    queryKey: ["PartsDamaged", appointmentId],
    queryFn: async () => {
      try {
        const response = await api.get<
          ResponseDto<DataDto<PartCategoryViewModel<PartDamagedModel>>>
        >(`/api/Appointment/vehicle-category/${appointmentId}`);
        console.log(response.data);

        return response.data;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg =
            error.response?.data.message ||
            error.message ||
            ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};
