import React, { useCallback, useEffect, useState } from "react";
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
} from "react-icons/pi";
import {
  BookingFormWrapper,
  BookingFormHeader,
  FormTitle,
  CloseButton,
  FormGroup,
  Label,
  LeftBody,
  RightBody,
  TextArea,
  BookingFormButton,
  SubSection,
  StepContent,
} from "./BookingForm.styled";
import { Checkbox } from "@mui/material";
import UploadImage from "../../../components/UploadFields/uploadImage";
import { getCustomerId } from "../../../services/customerServices";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import {
  createVehicle,
  getVehicleByCustomerId,
  getVehicleCategories,
} from "../../../services/vehicleServicesApi";
import { getAllServices } from "../../../services/serviceServicesApi";
import { getAccountInformation } from "../../../services/accountService";
import { handleError } from "../../../utils/errorHandler";
import { createAppointment } from "../../../services/appointmentServiceApi";
import { LICENSE_PLATE_REGEX } from "../../../constants/regexs/LicensePlateRegex";
import { ERROR_MESSAGE, MSG_TITLE } from "../../../constants/messages/Message";
import { LENGTH } from "../../../constants/Code/Constants";
import SpinnerComponent from "../../../components/SpinnerComponent";
import { useNotification } from "../../../context/useNotification";
import AppointmentPolicySection from "./AppointmentPolicySection";
import NameAndPhoneNumberSection from "./NameAndPhoneNumberSection";
import SelectVehicleSection from "./SelectVehicleSection";
import ServiceSection from "./ServiceSection";
import TimeSection from "./TimeSection";
import Stepper, { Step } from "../../../components/StepperComponent";
import { Modal } from "react-bootstrap";
import type { Dayjs } from "dayjs";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import type { VehicleCreateDto } from "../../../models/VehicleModels/VehicleCreateDto";
import type { AppointmentCreateModel } from "../../../models/AppointmentsModel/AppointmentCreateModel";

interface Props {
  show: boolean;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function BookingFormStepper({ show, handleClose, setLoading, loading }: Props) {
  const accountId = useSelector(
    (state: RootState) => state.auth.user?.accountId
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const [accountInfor, setAccountInfor] = useState<AccountViewModel>();
  const [listVehicleOfCustomer, setListVehicleOfCustomer] = useState<
    VehicleViewDto[]
  >([]);
  const [listCategories, setListCategories] = useState<
    VehicleCategoryViewDto[]
  >([]);
  const [serviceCategories, setServiceCategories] = useState<
    ServiceCategoryViewModel[]
  >([]);

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
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  const handleServiceCategoriesChange = useCallback(
    (serviceCategory: ServiceCategoryViewModel) => {
      const servicesInCategory = serviceCategory.services.map((s) => s.id);
      if (servicesInCategory.length === 0) return;
      setSelectedServices((prev) => {
        const allSelected = servicesInCategory.every((s) => prev.includes(s));
        return allSelected
          ? prev.filter((s) => !servicesInCategory.includes(s))
          : [...new Set([...prev, ...servicesInCategory])];
      });
    },
    []
  );

  const handleSelectDate = useCallback(
    (date: Dayjs | undefined) => {
      setDateSelected(date);
      if (date && timeSelected) {
        setAppointmentDate(
          date
            .hour(timeSelected.hour())
            .minute(timeSelected.minute())
            .second(0)
            .format("YYYY-MM-DDTHH:mm:ss")
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
          dateSelected
            .hour(time.hour())
            .minute(time.minute())
            .second(0)
            .format("YYYY-MM-DDTHH:mm:ss")
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
          if (!licensePlate) {
            newErrors.licensePlate = "License plate is required.";
          } else if (!LICENSE_PLATE_REGEX.test(licensePlate)) {
            newErrors.licensePlate = ERROR_MESSAGE.LICENSE_PLATE_WRONG;
          }
        } else if (selectedValue === 0) {
          newErrors.vehicleSelect = "Please select a vehicle.";
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
    [
      isAddNew,
      licensePlate,
      selectedValue,
      selectedServices,
      dateSelected,
      timeSelected,
    ]
  );

  const handleSubmit = useCallback(async () => {
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

  if (!show || loading) return null;

  return (
    <BookingFormWrapper show={show} data-lenis-prevent>
      <BookingFormHeader>
        <FormTitle>Booking Form</FormTitle>
        <CloseButton onClick={handleClose}>x</CloseButton>
      </BookingFormHeader>
      <Modal.Body>
        <Stepper
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          validateStep={validateStep}
          onFinalStepCompleted={handleSubmit}
          nextButtonText="Next"
          backButtonText="Back"
        >
          {/* Step 1 */}
          <Step>
            <StepContent>
              <LeftBody>
                <h5>
                  <PiNumberCircleOneFill /> Information
                </h5>
                <SubSection>
                  <NameAndPhoneNumberSection accountInfor={accountInfor} />
                </SubSection>
                <SubSection>
                  <SelectVehicleSection
                    isAddNew={isAddNew}
                    selectedValue={selectedValue}
                    handleSelectVehicle={handleSelectVehicle}
                    listVehicleOfCustomer={listVehicleOfCustomer}
                    listCategories={listCategories}
                    handleSelectVehicleCategory={(e) =>
                      setVehicleCategory(Number(e.target.value))
                    }
                    vehicleCategory={vehicleCategory}
                    setLicensePlate={setLicensePlate}
                    licensePlate={licensePlate}
                    errors={errors}
                  />
                  <FormGroup>
                    <Label>Image</Label>
                    <UploadImage
                      existingImages={files}
                      handleFileRemove={(url) =>
                        setFiles((prev) =>
                          prev.filter((item) => item.url !== url)
                        )
                      }
                      imgQuantity={LENGTH.IMAGES}
                      handleFileSubmit={(file) =>
                        setFiles((prev) => [...prev, file])
                      }
                    />
                  </FormGroup>
                </SubSection>
              </LeftBody>
            </StepContent>
          </Step>

          {/* Step 2 */}
          <Step>
            <StepContent>
              <RightBody>
                <h5>
                  <PiNumberCircleTwoFill /> Service
                </h5>
                <ServiceSection
                  serviceCategories={serviceCategories}
                  handleServiceCategoriesChange={handleServiceCategoriesChange}
                  handleSelectServices={handleSelectServices}
                  selectedServices={selectedServices}
                />
                {errors.services && (
                  <p style={{ color: "red", marginTop: "10px" }}>
                    {errors.services}
                  </p>
                )}
              </RightBody>
            </StepContent>
          </Step>

          {/* Step 3 */}
          <Step>
            <StepContent>
              <RightBody>
                <h5>
                  <PiNumberCircleThreeFill /> Time
                </h5>
                <TimeSection
                  date={dateSelected}
                  time={timeSelected}
                  handleSelectDate={handleSelectDate}
                  handleSelectTime={handleSelectTime}
                />
                {errors.date && <p style={{ color: "red" }}>{errors.date}</p>}
                {errors.time && <p style={{ color: "red" }}>{errors.time}</p>}
                <FormGroup>
                  <Label>Note</Label>
                  <TextArea
                    placeholder="Enter any additional notes..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </FormGroup>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15px",
                  }}
                >
                  {!visible && (
                    <Checkbox
                      color="success"
                      onChange={() => setCheckBox((prev) => !prev)}
                      checked={checkbox}
                    />
                  )}
                  <AppointmentPolicySection
                    visible={visible}
                    handleSetVisible={() => {
                      setVisible((p) => !p);
                      setCheckBox(false);
                    }}
                  />
                </div>

                {isLoading ? (
                  <SpinnerComponent />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "15px",
                    }}
                  >
                    <BookingFormButton>
                      <button
                        disabled={!checkbox}
                        type="button"
                        onClick={handleSubmit}
                      >
                        SEND
                      </button>
                    </BookingFormButton>
                  </div>
                )}
              </RightBody>
            </StepContent>
          </Step>
        </Stepper>
      </Modal.Body>
    </BookingFormWrapper>
  );
}

export default React.memo(BookingFormStepper);
