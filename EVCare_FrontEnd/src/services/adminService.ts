import axios from "axios";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { FullCustomerInfor } from "../models/CustomerModels/FullCustomerInfor";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import type { EmployeeStatusEnum, RoleEnum } from "../models/enums";
import type { EmployeeViewModel } from "../models/Employee/EmployeeViewModel";
import type { EmployeeRegisterDto } from "../models/Employee/EmployeeRegisterDto";
import type { TopServiceModel } from "../models/Statistic/TopServiceModel";
import type { TopPartModel } from "../models/Statistic/TopPartModel";
import type { PartHistoryUpdateModel } from "../models/Statistic/PartHistoryUpdateModel";
import type { ActionTypeEnum } from "../models/enums/ActionTypeEnum";

export async function getAllCustomerInformation(keyword: string, pageSize: number, pageIndex: number) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<FullCustomerInfor>>>("/api/Customer", {
      params: {
        keyword: keyword,
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function banAccount(accountId: number) {
  try {
    await api.delete(`/api/Account/${accountId}`);
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FAILED_TO_BANNED_ACCOUNT;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_BANNED_ACCOUNT);
  }
}

export async function getAllEmployee(
  keyword: string,
  role: RoleEnum,
  status: EmployeeStatusEnum,
  pageSize: number,
  pageIndex: number
) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<EmployeeViewModel>>>("/api/Employee", {
      params: {
        keyword: keyword,
        role: role,
        status: status,
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function addEmployee(data: EmployeeRegisterDto) {
  try {
    const response = await api.post<ResponseDto<number>>("/api/Auth/register-for-employee", data);
    return response.data;
  } catch (error) {
    handleError(error);
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message || ERROR_MESSAGE.FAILED_TO_ADD_EMPLOYEE;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.FAILED_TO_ADD_EMPLOYEE);
  }
}

export async function getEmployeeById(data: number) {
  try {
    const response = await api.get<ResponseDto<EmployeeViewModel>>("/api/Employee/admin-get-employee-id", {
      params: {
        employeeId: data,
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

export async function getTopServices(props: { fromDate?: string; toDate?: string; top: number }) {
  try {
    const response = await api.get<ResponseDto<TopServiceModel[]>>("/api/Statistic/top-services", {
      params: props,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getTopParts(props: { fromDate?: string; toDate?: string; top: number }) {
  try {
    const response = await api.get<ResponseDto<TopPartModel[]>>("/api/Statistic/top-parts", {
      params: props,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function getHistoryParts(props: {
  fromDate: string;
  toDate: string;
  keyword: string;
  actionType?: ActionTypeEnum;
  pageSize: number;
  pageIndex: number;
}) {
  try {
    const response = await api.get<ResponseDto<PageResultDto<PartHistoryUpdateModel>>>(
      "/api/Statistic/part-histories",
      {
        params: props,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updateTechnician(technicianId: number, expYears: number, kpiPerDays: number) {
  try {
    await api.put(
      "/api/Technician",
      { expYears, kpiPerDays },
      {
        params: {
          technicianId: technicianId,
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}

export async function updateTechnicianSkills(data: { technicianId: number; serviceIds: number[] }) {
  try {
    const response = await api.put("/api/TechnicianSkill", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data.message || error.message;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
