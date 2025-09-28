//NGO CHI VY
import { useState } from "react";
import { PiNumberCircleOneFill, PiNumberCircleTwoFill, PiNumberCircleThreeFill } from "react-icons/pi";
import { Plus } from "lucide-react";
import {
  BookingFormBody,
  BookingFormButton,
  BookingFormHeader,
  BookingFormWrapper,
  Checkbox,
  CloseButton,
  FormGroup,
  FormTitle,
  ImageUpload,
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

interface Props {
  show: boolean;
  handleClose: () => void;
}
export default function BookingForm({ show, handleClose }: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>(["General Repairs"]);

  if (!show) return null;

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
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
              <Input type="text" defaultValue="Alex Nguyen" />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input type="tel" defaultValue="0987654321" />
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
                Vehicle <Required>*</Required>
              </Label>
              <Select>
                <option value="">Select Vehicle</option>
                <option value="sedan">Vinfast</option>
                <option value="suv">BWD</option>
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
              <Input type="text" placeholder="Input" />
            </FormGroup>
            <FormGroup>
              <Label>
                Vehicle License Plate <Required>*</Required>
              </Label>
              <Input type="text" placeholder="Ex:50G-99999" />
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
              <ImageUpload>
                <Plus size={24} color="#9ca3af" />
              </ImageUpload>
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

            <ServiceOption>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedServices.includes("Vehicle Maintenance")}
                  onChange={() => handleServiceChange("Vehicle Maintenance")}
                />
                <span>Vehicle Maintenance</span>
              </div>
              <MoreInfoLink>More Info</MoreInfoLink>
            </ServiceOption>

            <ServiceOption>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedServices.includes("General Repairs")}
                  onChange={() => handleServiceChange("General Repairs")}
                />
                <span>General Repairs</span>
              </div>
              <MoreInfoLink>More Info</MoreInfoLink>
            </ServiceOption>

            <ServiceOption>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  type="checkbox"
                  checked={selectedServices.includes("Repaint")}
                  onChange={() => handleServiceChange("Repaint")}
                />
                <span>Repaint</span>
              </div>
              <MoreInfoLink>More Info</MoreInfoLink>
            </ServiceOption>
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
