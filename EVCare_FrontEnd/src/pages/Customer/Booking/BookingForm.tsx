import React, { useCallback, useEffect, useState } from "react";
import { PiNumberCircleOneFill, PiNumberCircleTwoFill, PiNumberCircleThreeFill } from "react-icons/pi";
// import { Plus } from "lucide-react";
import {
  BookingFormBody,
  BookingFormButton,
  BookingFormHeader,
  BookingFormWrapper,
  CloseButton,
  FormGroup,
  FormTitle,
  Label,
  LeftBody,
  NumberIcon,
  RightBody,
  SubSection,
  SubTitle,
  TextArea,
} from "./BookingForm.styled";
import UploadImage from "../../../components/UploadFields/uploadImage";
import { getCustomerId } from "../../../services/customerServices";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { createVehicle, getVehicleByCustomerId, getVehicleCategories } from "../../../services/vehicleServices";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";
import { getAllServices } from "../../../services/serviceServices";
import { handleError } from "../../../utils/errorHandler";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import { getAccountInformation } from "../../../services/accountService";
import SelectVehicleSection from "./SelectVehicleSection";
import NameAndPhoneNumberSection from "./NameAndPhoneNumberSection";
import ServiceSection from "./ServiceSection";
import type { Dayjs } from "dayjs";
import TimeSection from "./TimeSection";
import type { AppointmentCreateModel } from "../../../models/AppointmentsModel/AppointmentCreateModel";
import { createAppointment } from "../../../services/appointmentServices";
import SpinnerComponent from "../../../components/SpinnerComponent";
import type { VehicleCreateDto } from "../../../models/VehicleModels/VehicleCreateDto";

interface Props {
  show: boolean;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
export default function BookingForm({ show, handleClose, setLoading, loading }: Props) {
  const accountId = useSelector((state: RootState) => state.auth.user?.accountId);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [listVehicleOfCustomer, setListVehicleOfCustomer] = useState<VehicleViewDto[]>([]);
  const [selectedValue, setSelectedValue] = useState(0);
  const [isAddNew, setIsAddNew] = useState(true);
  const [listCategories, setListCategories] = useState<VehicleCategoryViewDto[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategoryViewModel[]>([]);
  const [accountInfor, setAccountInfor] = useState<AccountViewModel>();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [dateSelected, setDateSelected] = useState<Dayjs>();
  const [timeSelected, setTimeSelected] = useState<Dayjs>();
  const [note, setNote] = useState("");
  const [vehicleCategory, setVehicleCategory] = useState(0);
  const [licensePlate, setLicensePlate] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectVehicle = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === "add") {
        setIsAddNew(true);
        setSelectedValue(0);
      } else {
        setIsAddNew(false);
        const vehicle = listVehicleOfCustomer.find((v) => v.id === Number(e.target.value));
        setVehicleCategory(listCategories.find((c) => c.id === vehicle?.cateId)?.id || 0);
        setSelectedValue(Number(e.target.value));
      }
    },
    [setVehicleCategory, listVehicleOfCustomer, setSelectedValue, setIsAddNew, listCategories]
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
      if (allSelected) {
        return prev.filter((s) => !servicesInCategory.includes(s));
      } else {
        const currSelect = [...prev];
        servicesInCategory.forEach((e) => {
          if (!currSelect.includes(e)) currSelect.push(e);
        });
        return currSelect;
      }
    });
  }, []);

  const handleSelectDate = useCallback((dateSelected: Dayjs | undefined, timeSelected: Dayjs | undefined) => {
    setDateSelected(dateSelected);
    if (dateSelected && timeSelected) {
      setAppointmentDate(dateSelected.hour(timeSelected.hour()).minute(timeSelected.minute()).second(0).toISOString());
    }
  }, []);

  const handleSelectTime = useCallback((dateSelected: Dayjs | undefined, timeSelected: Dayjs | undefined) => {
    setTimeSelected(timeSelected);
    if (dateSelected && timeSelected) {
      setAppointmentDate(dateSelected.hour(timeSelected.hour()).minute(timeSelected.minute()).second(0).toISOString());
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    if (note.length > 0) setNote(note.trim());
    if (selectedValue === 0) {
      const data: VehicleCreateDto = {
        categoryId: vehicleCategory,
        licensePlate: licensePlate,
      };
      console.log("Bien So Xe :" + data);

      try {
        const response = await createVehicle(data);
        setSelectedValue(response.data ?? 0);
      } catch (error) {
        alert(error);
      }
    }

    const data: AppointmentCreateModel = {
      vehicleId: selectedValue,
      note: note,
      appointment_Date: appointmentDate,
      imagesUrls: ["abc", "def", "hehe"],
      serviceIds: selectedServices,
    };
    console.log("appoint in4: " + data);
    try {
      const response = await createAppointment(data);
      alert(response.message);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      setSelectedValue(0);
      setSelectedServices([]);
      setAppointmentDate("");
      setVehicleCategory(0);
      setLicensePlate("");
      setNote("");
    }
  }, [selectedValue, selectedServices, appointmentDate, vehicleCategory, licensePlate, note]);

  useEffect(() => {
    if (!show) return;
    if (!isAuthenticated || !accountId) return;
    const fetchData = async () => {
      setLoading(true);
      const customer = await getCustomerId(accountId);
      if (customer == null || customer == undefined) {
        handleError("Fail when fetch data in booking form");
        return;
      }
      const account = await getAccountInformation();
      setAccountInfor(account.data);
      const listVehicleOfCustomer = await getVehicleByCustomerId(customer.data?.id ?? 0);
      if (!listVehicleOfCustomer) {
        handleError("Error in BookingForm.tsx");
        return;
      }
      setListVehicleOfCustomer(listVehicleOfCustomer.data ?? []);
      const listVehicleCategories = await getVehicleCategories();
      if (!listVehicleCategories) {
        handleError("Error in BookingForm.tsx");
        return;
      }
      setListCategories(listVehicleCategories.data ?? []);

      const services = await getAllServices();
      if (!services) {
        handleError("Error in BookingForm.tsx");
        return;
      }
      setServiceCategories(services.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, [accountId, isAuthenticated, show, setLoading]);

  if (!show || loading) return null;

  return (
    <BookingFormWrapper show={show}>
      <BookingFormHeader>
        <FormTitle>Booking Form</FormTitle>
        <CloseButton onClick={handleClose}>Close</CloseButton>
      </BookingFormHeader>
      <BookingFormBody>
        <LeftBody>
          <SubTitle>
            <NumberIcon as={PiNumberCircleOneFill} />
            <h5>Information</h5>
          </SubTitle>
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
              setVehicleCategory={setVehicleCategory}
              vehicleCategory={vehicleCategory}
              setLicensePlate={setLicensePlate}
            />
            <FormGroup>
              <Label>Image</Label>
              <UploadImage></UploadImage>
            </FormGroup>
          </SubSection>
        </LeftBody>
        <RightBody>
          <SubTitle>
            <NumberIcon as={PiNumberCircleTwoFill} />
            <h5>Service</h5>
          </SubTitle>
          <SubSection>
            <ServiceSection
              serviceCategories={serviceCategories}
              handleServiceCategoriesChange={handleServiceCategoriesChange}
              handleSelectServices={handleSelectServices}
              selectedServices={selectedServices}
            />
          </SubSection>
          <SubTitle>
            <NumberIcon as={PiNumberCircleThreeFill} />
            <h5>Time</h5>
          </SubTitle>
          <SubSection>
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)}
              />
            </FormGroup>
          </SubSection>
        </RightBody>
      </BookingFormBody>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <BookingFormButton>
          <button type="button" onClick={handleSubmit}>
            SEND
          </button>
        </BookingFormButton>
      )}
    </BookingFormWrapper>
  );
}
