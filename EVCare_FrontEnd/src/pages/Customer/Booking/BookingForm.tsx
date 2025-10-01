//NGO CHI VY
import { useEffect, useState } from "react";
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
} from "react-icons/pi";
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
import {
  getVehicleByCustomerId,
  getVehicleCategories,
} from "../../../services/vehicleServicesApi";
import { createVehicle, getVehicleByCustomerId, getVehicleCategories } from "../../../services/vehicleServices";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";
import { getAllServices } from "../../../services/serviceServicesApi";
import { handleError } from "../../../utils/errorHandler";
import type { AccountViewModel } from "../../../models/Accounts/accountViewModel";
import { getAccountInformation } from "../../../services/accountService";
import SelectVehicleSection from "./SelectVehicleSection";
import NameAndPhoneNumberSection from "./NameAndPhoneNumberSection";
import ServiceSection from "./ServiceSection";
import { Dayjs } from "dayjs";
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
export default function BookingForm({ show, handleClose }: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const accountId = useSelector(
    (state: RootState) => state.auth.user?.accountId
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [customerId, setCustomerId] = useState(0);
  const [listVehicleOfCustomer, setListVehicleOfCustomer] = useState<
    VehicleViewDto[]
  >([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [isAddNew, setIsAddNew] = useState(false);
  const [listCategories, setListCategories] = useState<
    VehicleCategoryViewDto[]
  >([]);
  const [serviceCategories, setServiceCategories] = useState<
    ServiceCategoryViewModel[]
  >([]);
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
  const [urls, setUrls] = useState<string[]>([]);

  const handleSelectVehicle = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = Number(e.target.value);
      if (value === 0) {
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

  const handleSelectDate = useCallback(
    (date: Dayjs | undefined) => {
      setDateSelected(date);
      if (date && timeSelected) {
        setAppointmentDate(date.hour(timeSelected.hour()).minute(timeSelected.minute()).second(0).toISOString());
      }
    },
    [timeSelected]
  );

  const handleSelectTime = useCallback(
    (time: Dayjs | undefined) => {
      setTimeSelected(time);
      if (dateSelected && time) {
        setAppointmentDate(dateSelected.hour(time.hour()).minute(time.minute()).second(0).toISOString());
      }
    },
    [dateSelected]
  );

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    let tmp = 0;
    if (note.length > 0) setNote(note.trim());
    if (selectedValue === 0) {
      try {
        const data: VehicleCreateDto = {
          categoryId: vehicleCategory,
          licensePlate: licensePlate,
        };
        const response = await createVehicle(data);
        tmp = response.data ?? 0;
        setSelectedValue(tmp);
      } catch (error) {
        handleError(error);
        alert(error);
        setIsLoading(false);
        setLicensePlate("");
        setIsAddNew(true);
        return;
      }
    }

    const data: AppointmentCreateModel = {
      vehicleId: tmp !== 0 ? tmp : selectedValue,
      note: note.trim(),
      appointment_Date: appointmentDate,
      imagesUrls: urls,
      serviceIds: selectedServices,
    };
    try {
      const response = await createAppointment(data);
      alert(response.message);
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
      setSelectedServices([]);
      setAppointmentDate("");
      setLicensePlate("");
      setNote("");
      setDateSelected(undefined);
      setTimeSelected(undefined);
      setSelectedValue(0);
      setIsAddNew(true);
    }
  }, [selectedValue, selectedServices, appointmentDate, vehicleCategory, licensePlate, note, urls]);

  const handleNoteChange = useCallback((note: string) => {
    setNote(note);
  }, []);

  const handleSelectVehicleCategory = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleCategory(Number(e.target.value));
  }, []);

  const handleFileSubmit = useCallback((url: string) => {
    setUrls((prev) => [...prev, url]);
  }, []);

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
  }, [accountId, customerId, isAuthenticated]);

  if (!show) return null;

  const handleServiceChange = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };
  }, [accountId, isAuthenticated, show, setLoading]);

  useEffect(() => {
    if (listCategories.length === 0) return;
    setVehicleCategory(listCategories[0].id);
  }, [listCategories]);

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
            <SubTitle
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Vehicle
            </SubTitle>
            <FormGroup>
              <Label>
                Your Vehicle License Plate <Required>*</Required>
              </Label>
              <Select
                value={isAddNew ? "add" : selectedValue}
                onChange={handleSelectVehicle}
              >
                {listVehicleOfCustomer.map((v) => (
                  <option key={v.id} value={v.categoryName}>
                    {v.licensePlate}
                  </option>
                ))}
                <option value={"add"}>Add Vehicle</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Kilometers</Label>
              <Input type="number" min={0} placeholder="Enter kilometers" />
            </FormGroup>
            <FormGroup>
              <Label>
                Vehicle Model <Required>*</Required>
              </Label>
              {isAddNew ? (
                <Select>
                  {listCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type="text"
                  disabled
                  value={
                    listCategories.find((c) => c.name === selectedValue)?.name
                  }
                />
              )}
            </FormGroup>
            <FormGroup>
              {isAddNew && (
                <>
                  <Label>
                    Vehicle License Plate <Required>*</Required>
                  </Label>
                  <Input type="text" placeholder="Ex:50G-99999" />
                </>
              )}
            </FormGroup>
            <SelectVehicleSection
              isAddNew={isAddNew}
              selectedValue={selectedValue}
              handleSelectVehicle={handleSelectVehicle}
              listVehicleOfCustomer={listVehicleOfCustomer}
              listCategories={listCategories}
              handleSelectVehicleCategory={handleSelectVehicleCategory}
              vehicleCategory={vehicleCategory}
              setLicensePlate={setLicensePlate}
              licensePlate={licensePlate}
            />
            <FormGroup>
              <Label>Image</Label>
              <UploadImage handleFileSubmit={handleFileSubmit}></UploadImage>
            </FormGroup>
          </SubSection>
        </LeftBody>
        <RightBody>
          <SubTitle>
            <NumberIcon as={PiNumberCircleTwoFill} />
            <h5>Service</h5>
          </SubTitle>
          <SubSection>
            <Label>
              Service <Required>*</Required>
            </Label>

            {serviceCategories.map((c) => (
              <ServiceOption key={c.name}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Checkbox
                    type="checkbox"
                    onChange={() => handleServiceChange(c.name)}
                  />
                  <span>{c.name}</span>
                </div>
                <MoreInfoLink>More Info</MoreInfoLink>
              </ServiceOption>
            ))}
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
                value={note}
                onChange={(e) => handleNoteChange(e.target.value)}
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
