//NGO CHI VY
import { useEffect, useState } from "react";
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
} from "react-icons/pi";
// import { Plus } from "lucide-react";
import {
  BookingFormBody,
  BookingFormButton,
  BookingFormHeader,
  BookingFormWrapper,
  Checkbox,
  CloseButton,
  FormGroup,
  FormTitle,
  Input,
  Label,
  LeftBody,
  MoreInfoLink,
  NumberIcon,
  Required,
  RightBody,
  Select,
  ServiceOption,
  SubSection,
  SubTitle,
  TextArea,
  TimeInput,
  TimeInputField,
  TimeInputGroup,
} from "./BookingForm.styled";
import UploadImage from "../../../components/UploadFields/uploadImage";
import { getCustomerId } from "../../../services/customerServices";
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import {
  getVehicleByCustomerId,
  getVehicleCategories,
} from "../../../services/vehicleServicesApi";
import type { VehicleViewDto } from "../../../models/VehicleModels/vehicleViewDto";
import type { VehicleCategoryViewDto } from "../../../models/VehicleModels/vehicleCategoryViewDto";
import type { ServiceCategoryViewModel } from "../../../models/ServicesModel/ServiceCategoryViewModel";
import { getAllServices } from "../../../services/serviceServicesApi";
import { handleError } from "../../../utils/errorHandler";

interface Props {
  show: boolean;
  handleClose: () => void;
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

  useEffect(() => {
    console.log(selectedServices);
  }, [selectedServices]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchData = async () => {
      const customer = await getCustomerId(accountId ?? 0);
      if (customer == null || customer == undefined) {
        handleError("Fail when fetch data in booking form");
        return;
      }
      setCustomerId(customer.data?.id ?? 0);

      const listVehicleOfCustomer = await getVehicleByCustomerId(customerId);
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

  const handleSelectVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "add") {
      setIsAddNew(true);
      setSelectedValue("");
    } else {
      setIsAddNew(false);
      setSelectedValue(value);
    }
  };

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
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" disabled defaultValue="Alex Nguyen" />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input type="tel" disabled defaultValue="0987654321" />
            </FormGroup>
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
            <FormGroup>
              <Label>Image</Label>
              {/* <ImageUpload>
                <Plus size={24} color="#9ca3af" />
              </ImageUpload> */}
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
          </SubSection>
          <SubTitle>
            <NumberIcon as={PiNumberCircleThreeFill} />
            <h5>Time</h5>
          </SubTitle>
          <SubSection>
            <FormGroup>
              <Label>
                Time <Required>*</Required>
              </Label>
              <TimeInputGroup>
                <TimeInput>
                  <TimeInputField type="date" placeholder="Date" />
                </TimeInput>
                <TimeInput>
                  <TimeInputField type="time" placeholder="Time" />
                </TimeInput>
              </TimeInputGroup>
            </FormGroup>

            <FormGroup>
              <Label>Note</Label>
              <TextArea placeholder="Enter any additional notes..." />
            </FormGroup>
          </SubSection>
        </RightBody>
      </BookingFormBody>
      <BookingFormButton>
        <button>SEND</button>
      </BookingFormButton>
    </BookingFormWrapper>
  );
}
