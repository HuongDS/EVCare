import { useMutation, useQuery } from "@tanstack/react-query";
import type { GetCustomerListParams } from "../models/CustomerModels/CustomerViewDto";
import { api } from "../api/api";
import type { ResponseDto } from "../models/AuthModel/authModel";
import type { PageResultDto } from "../models/PageResult/PageResultDto";
import type { FullCustomerInfor } from "../models/CustomerModels/FullCustomerInfor";
import { handleError } from "../utils/errorHandler";
import type { CategoryResponseDTO } from "../models/OrderPartModel/Category_Model";
import type { GetPartParams, PartDetailDto } from "../models/PartModel/PartModel";
import axios from "axios";
import { ERROR_MESSAGE } from "../constants/messages/Message";
import dayjs from "dayjs";
import type { UpdateInventoryPayload } from "../models/Inventory/InventoryModel";
import type { EmployeeStatusViewModel } from "../models/Employee/EmployeeStatusViewModel";

interface GetPartCategoryParams {
  pageSize?: number;
  pageIndex?: number;
}

export const useGetAllCustomer = (params: GetCustomerListParams) => {
  return useQuery({
    queryKey: ["ListCustomers", params],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<PageResultDto<FullCustomerInfor>>>("/api/Customer", { params });
        return response.data;
      } catch (error) {
        handleError(error);
        throw error;
      }
    },
  });
};

export const useGetAllPartCategories = (params: GetPartCategoryParams) => {
  return useQuery({
    queryKey: ["PartCategories", params],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<PageResultDto<CategoryResponseDTO>>>("/api/PartCategory", {
          params,
        });
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
};

export const useGetParts = (params: GetPartParams) => {
  return useQuery({
    queryKey: ["PartList", params],
    queryFn: async () => {
      try {
        const response = await api.get<ResponseDto<PageResultDto<PartDetailDto>>>("/api/Part", { params });
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  });
};

export const useExportInventoryToExcel = () => {
  return useMutation({
    mutationKey: ["ExportInventoryToExcel"],
    mutationFn: async () => {
      try {
        const response = await api.get("/api/Part/export", {
          responseType: "blob",
          headers: {
            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        });

        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Inventory_${dayjs().format("DD-MM-YYYY")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        return true;
      } catch (error) {
        handleError(error);
        if (axios.isAxiosError(error)) {
          const errMsg = error.response?.data?.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
          throw new Error(errMsg);
        }
        throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
      }
    },
  });
};

export const useUpdateInventoryQuantity = () => {
  return useMutation({
    mutationFn: async (payload: UpdateInventoryPayload) => {
      try {
        const response = await api.put<ResponseDto<number | null>>("/api/Part/staff", payload);
        return response.data;
      } catch (error) {}
    },
  });
};

export const useUpdateInventoryImage = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<ResponseDto<string>>("/api/File/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          FolderName: "Parts",
        },
      });

      return response.data.data;
    },
  });
};

export async function checkStaffAvailable(data: number) {
  try {
    const response = await api.get<ResponseDto<EmployeeStatusViewModel>>(`/api/Employee/customer/${data}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errMsg = error.response?.data?.message || error.message || ERROR_MESSAGE.FETCH_DATA_FAILED;
      throw new Error(errMsg);
    }
    throw new Error(ERROR_MESSAGE.SOME_THING_WENT_WRONG);
  }
}
