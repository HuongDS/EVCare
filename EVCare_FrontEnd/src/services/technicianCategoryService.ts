import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import type { EmployeeSkillCategoryViewModel } from "../models/Employee/EmployeeSkillCategoryViewModel";

export async function getTechnicianCategories(search: string) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<EmployeeSkillCategoryViewModel>>>(
      "/api/TechnicianCategory",
      {
        params: {
          search: search,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.SOME_THING_WENT_WRONG;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
