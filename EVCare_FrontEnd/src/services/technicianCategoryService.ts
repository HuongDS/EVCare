import axios from "axios";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { EmployeeSkillCategoryViewModel } from "../models/Employee/EmployeeSkillCategoryViewModel";

export async function getTechnicianCategories() {
  try {
    const response = await api.get<ResponseDto<EmployeeSkillCategoryViewModel[]>>("/api/ServiceCategory");
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
