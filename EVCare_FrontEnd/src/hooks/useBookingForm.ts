import { useCallback, useEffect, useState } from "react";
import type { AccountViewModel } from "../models/Accounts/accountViewModel";
import type { VehicleViewDto } from "../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryViewDto } from "../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../models/ServicesModel/ServiceCategoryViewModel";
import type { Dayjs } from "dayjs";
import { useNotification } from "../context/useNotification";
import { handleError } from "../utils/errorHandler";
import { ERROR_MESSAGE, MSG_TITLE } from "../constants/messages/Message";
import type { VehicleCreateDto } from "../models/VehicleModels/VehicleCreateDto";
import { createVehicle, getVehicleByCustomerId, getVehicleCategories } from "../services/vehicleServicesApi";
import type { AppointmentCreateModel } from "../models/AppointmentsModel/AppointmentCreateModel";
import { createAppointment } from "../services/appointmentServiceApi";
import { LICENSE_PLATE_REGEX } from "../constants/regexs/LicensePlateRegex";
import { getCustomerId } from "../services/customerServices";
import { getAccountInformation } from "../services/accountService";
import { getAllServices } from "../services/serviceServicesApi";

export interface UseBookingFormProps {
  show: boolean;
  setLoading: (loading: boolean) => void;
  handleClose: () => void;
  accountId: number | undefined;
  isAuthenticated: boolean;
}

export const useBookingForm = ({ show, setLoading, handleClose, accountId, isAuthenticated }: UseBookingFormProps) => {
  const [accountInfor, setAccountInfor] = useState<AccountViewModel>();
  const [listVehicleOfCustomer, setListVehicleOfCustomer] = useState<VehicleViewDto[]>([]);
  const [listCategories, setListCategories] = useState<VehicleCategoryViewDto[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryViewModel[]>([]);

  const [selectedValue, setSelectedValue] = useState(0);
  const [isAddNew, setIsAddNew] = useState(true);
  const [vehicleCategory, setVehicleCategory] = useState(0);
  const [licensePlate, setLicensePlate] = useState("");
  const [files, setFiles] = useState<{ url: string; name: string }[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dateSelected, setDateSelected] = useState<Dayjs>();
  const [timeSelected, setTimeSelected] = useState<Dayjs>();
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckBox] = useState(false);
  const [visible, setVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const notification = useNotification();

  const resetForm = useCallback(() => {
    setSelectedValue(0);
    setIsAddNew(true);
    setVehicleCategory(0);
    setLicensePlate("");
    setFiles([]);
    setSelectedServices([]);
    setDateSelected(undefined);
    setTimeSelected(undefined);
    setNote("");
    setCheckBox(false);
    setVisible(false);
    setErrors({});
    setCurrentStep(0);
  }, []);

  const handleSelectVehicle = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      if (value === 0) {
        setIsAddNew(true);
        setSelectedValue(0);
      } else {
        setIsAddNew(false);
        const vehicle = listVehicleOfCustomer.find((v) => v.id === value);
        if (vehicle) {
          setVehicleCategory(vehicle.cateId);
          setLicensePlate(vehicle.licensePlate);
          setSelectedValue(vehicle.id);
        }
      }
    },
    [listVehicleOfCustomer]
  );

  const handleSelectServices = useCallback((serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((s) => s !== serviceId) : [...prev, serviceId]
    );
  }, []);

  const handleServiceCategoriesChange = useCallback((serviceCategory: ServiceCategoryViewModel) => {
    const servicesInCategory = serviceCategory.services.map((s) => s.id);
    if (servicesInCategory.length === 0) return;
    setSelectedServices((prev) => {
      const allSelected = servicesInCategory.every((s) => prev.includes(s));
      return allSelected
        ? prev.filter((s) => !servicesInCategory.includes(s))
        : [...new Set([...prev, ...servicesInCategory])];
    });
  }, []);

  const handleSelectDate = useCallback(
    (date: Dayjs | undefined) => {
      setDateSelected(date);
      if (date && timeSelected) {
        setAppointmentDate(
          date.hour(timeSelected.hour()).minute(timeSelected.minute()).second(0).format("YYYY-MM-DDTHH:mm:ss")
        );
      }
    },
    [timeSelected]
  );

  const handleSelectTime = useCallback(
    (time: Dayjs | undefined) => {
      setTimeSelected(time);
      if (dateSelected && time) {
        setAppointmentDate(
          dateSelected.hour(time.hour()).minute(time.minute()).second(0).format("YYYY-MM-DDTHH:mm:ss")
        );
      }
    },
    [dateSelected]
  );
  const validateStep = useCallback(
    (stepIndex: number) => {
      const newErrors: Record<string, string> = {};

      if (stepIndex === 0) {
        if (isAddNew) {
          if (!vehicleCategory || vehicleCategory === 0) {
            newErrors.vehicleCategory = "Please select a vehicle model.";
          }
          if (!licensePlate) {
            newErrors.licensePlate = "License plate is required.";
          } else if (!LICENSE_PLATE_REGEX.test(licensePlate)) {
            newErrors.licensePlate = ERROR_MESSAGE.LICENSE_PLATE_WRONG;
          }
        }
        if (vehicleCategory === 0) {
          newErrors.vehicleSelect = "This model is not accepted at our center!";
        }
      }

      if (stepIndex === 1 && selectedServices.length === 0) {
        newErrors.services = "Please select at least one service.";
      }

      if (stepIndex === 2) {
        if (!dateSelected) newErrors.date = "Please select a date.";
        if (!timeSelected) newErrors.time = "Please select a time.";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [isAddNew, licensePlate, selectedValue, selectedServices, dateSelected, timeSelected]
  );

  const handleSubmit = useCallback(async () => {
    if (!validateStep(2)) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: "Please select both date and time for the appointment.",
      });
      return;
    }

    if (!checkbox) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: "Please agree to the appointment policy.",
      });
      return;
    }

    setIsLoading(true);
    let vehicleId = selectedValue;
    try {
      if (isAddNew && licensePlate) {
        const newVehicle: VehicleCreateDto = {
          categoryId: vehicleCategory,
          licensePlate,
        };
        const res = await createVehicle(newVehicle);
        vehicleId = res.data ?? 0;
      }

      const data: AppointmentCreateModel = {
        vehicleId,
        note: note.trim(),
        appointment_Date: appointmentDate,
        imagesUrls: files.map((f) => f.url),
        serviceIds: selectedServices,
      };

      const response = await createAppointment(data);
      notification.success({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: response.message,
      });
      resetForm();
      handleClose();
    } catch (error) {
      handleError(error);
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    isAddNew,
    licensePlate,
    vehicleCategory,
    selectedValue,
    appointmentDate,
    files,
    selectedServices,
    note,
    checkbox,
    handleClose,
    notification,
    resetForm,
    validateStep,
  ]);

  useEffect(() => {
    if (!show || !isAuthenticated || !accountId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const customer = await getCustomerId(accountId);
        const acc = await getAccountInformation();
        const vehicles = await getVehicleByCustomerId(customer?.data?.id ?? 0);
        const categories = await getVehicleCategories();
        const services = await getAllServices();

        setAccountInfor(acc?.data);
        setListVehicleOfCustomer(vehicles?.data ?? []);
        setListCategories(categories?.data ?? []);
        setServiceCategories(services?.data ?? []);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [show, accountId, isAuthenticated, setLoading]);

  useEffect(() => {
    if (!show) {
      resetForm();
    }
  }, [show, resetForm]);

  useEffect(() => {
    if (isAddNew) {
      setVehicleCategory(0);
      setLicensePlate("");
    }
  }, [isAddNew]);

  return {
    accountInfor,
    listVehicleOfCustomer,
    listCategories,
    serviceCategories,
    selectedValue,
    isAddNew,
    vehicleCategory,
    licensePlate,
    files,
    selectedServices,
    dateSelected,
    timeSelected,
    note,
    isLoading,
    checkbox,
    visible,
    currentStep,
    errors,

    setVehicleCategory,
    setLicensePlate,
    setFiles,
    setNote,
    setCheckBox,
    setVisible,
    setCurrentStep,
    setIsAddNew,
    setSelectedServices,
    setDateSelected,
    setTimeSelected,

    handleSelectVehicle,
    handleSelectServices,
    handleServiceCategoriesChange,
    handleSelectDate,
    handleSelectTime,
    validateStep,
    handleSubmit,
  };
};
