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
  const [urls, setUrls] = useState<string[]>([]);

  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dateSelected, setDateSelected] = useState<Dayjs>();
  const [timeSelected, setTimeSelected] = useState<Dayjs>();
  const [note, setNote] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [checkbox, setCheckBox] = useState(false);
  const [visible, setVisible] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");

  const notification = useNotification();

  // --- logic chọn xe ---
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

  // --- dịch vụ ---
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

  // --- ngày giờ ---
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

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    if (!LICENSE_PLATE_REGEX.test(licensePlate)) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: ERROR_MESSAGE.LICENSE_PLATE_WRONG,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }
    if (selectedServices.length === 0) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: ERROR_MESSAGE.SERVICES_MUST_NOT_BE_EMPTY,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }
    if (!dateSelected || !timeSelected) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: ERROR_MESSAGE.DATE_AND_TIME_CAN_NOT_BE_EMPTY,
        showProgress: true,
      });
      setIsLoading(false);
      return;
    }

    let vehicleId = selectedValue;
    if (isAddNew && licensePlate) {
      try {
        const newVehicle: VehicleCreateDto = {
          categoryId: vehicleCategory,
          licensePlate,
        };
        const res = await createVehicle(newVehicle);
        vehicleId = res.data ?? 0;
      } catch (error) {
        handleError(error);
        notification.error({
          message: MSG_TITLE.CREATE_APPOINTMENT,
          description: (error as Error).message,
          showProgress: true,
        });
        setIsLoading(false);
        return;
      }
    }

    const data: AppointmentCreateModel = {
      vehicleId,
      note: note.trim(),
      appointment_Date: appointmentDate,
      imagesUrls: urls,
      serviceIds: selectedServices,
    };

    try {
      const response = await createAppointment(data);
      notification.success({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: response.message,
        showProgress: true,
      });
      handleClose();
    } catch (error) {
      notification.error({
        message: MSG_TITLE.CREATE_APPOINTMENT,
        description: (error as Error).message,
        showProgress: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    licensePlate,
    selectedServices,
    dateSelected,
    timeSelected,
    appointmentDate,
    isAddNew,
    selectedValue,
    vehicleCategory,
    urls,
    note,
    handleClose,
    notification,
  ]);

  // --- fetch data ---
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

  // --- giao diện ---
  if (!show || loading) return null;

  return (
    <BookingFormWrapper show={show} data-lenis-prevent>
      <BookingFormHeader>
        <FormTitle>Booking Form</FormTitle>
        <CloseButton onClick={handleClose}>x</CloseButton>
      </BookingFormHeader>
      <Modal.Body>
        <Stepper
          onFinalStepCompleted={handleSubmit}
          nextButtonText="Next"
          backButtonText="Back"
        >
          <Step>
            <StepContent data-lenis-prevent>
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
                  />
                  <FormGroup>
                    <Label>Image</Label>
                    <UploadImage
                      handleFileRemove={(url) =>
                        setUrls((prev) => prev.filter((item) => item !== url))
                      }
                      imgQuantity={LENGTH.IMAGES}
                      handleFileSubmit={(url) =>
                        setUrls((prev) => [...prev, url])
                      }
                    />
                  </FormGroup>
                </SubSection>
              </LeftBody>
            </StepContent>
          </Step>

          {/* Step 2: Service */}
          <Step>
            <StepContent data-lenis-prevent>
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
              </RightBody>
            </StepContent>
          </Step>

          {/* Step 3: Time */}
          <Step>
            <StepContent data-lenis-prevent>
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
                  <BookingFormButton>
                    <button
                      disabled={!checkbox}
                      type="button"
                      onClick={handleSubmit}
                    >
                      SEND
                    </button>
                  </BookingFormButton>
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
