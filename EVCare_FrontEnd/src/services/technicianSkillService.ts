import axios from "axios";
import type { TechinicianSkillRegistDto } from "../models/Techinician/TechinicianSkillRegisterDto";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import { api } from "../api/api";

export async function addSkillToTechnician(data: TechinicianSkillRegistDto) {
  try {
    await api.post("/api/TechnicianSkill", data);
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.SOME_THING_WENT_WRONG;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
