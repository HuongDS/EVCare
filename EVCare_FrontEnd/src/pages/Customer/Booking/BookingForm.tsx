//NGO CHI VY
import { useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  PiNumberCircleOneFill,
  PiNumberCircleTwoFill,
  PiNumberCircleThreeFill,
} from "react-icons/pi";
import { Plus } from "lucide-react";

const BookingFormWrapper = styled(Modal)`
  .modal-dialog {
    max-width: 70%;
    height: max-content;
  }

  .modal-content {
    height: 100%;
    font-family: "Outfit", sans-serif;
    padding: 20px;
  }
`;

const SubSection = styled.div`
  margin-bottom: 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 3px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const BookingFormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FormTitle = styled.h2`
  width: 60%;
  display: flex;
  justify-content: flex-end;
  font-weight: 600;
  color: #00ad4e;
`;

const CloseButton = styled.button`
  font-size: 1em;
  height: 50%;
  border: none;
  border-radius: 5px;
  background-color: #ccc;
  color: white;
  &:hover {
    color: red;
    background-color: white;
    border: 1px solid #ccc;
  }
`;

const BookingFormBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 80%;
  padding: 0 5%;
`;

const SubTitle = styled.div`
  display: flex;
  gap: 2%;
  h5 {
    font-weight: 600;
    color: #00ad4e;
  }
`;

const NumberIcon = styled.i`
  color: #00ad4e;
  font-size: 1.7em;
`;

const LeftBody = styled.div`
  margin: 0 10%;
`;
const ImageUpload = styled.div`
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  margin-top: 8px;

  &:hover {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;
const Required = styled.span`
  color: #ef4444;
`;

const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 10%;
`;

const BookingFormButton = styled.div`
  display: flex;
  justify-content: center;
  button {
    width: 20%;
    padding: 8px;
    border: none;
    border-radius: 10px;
    background-color: #00ad4e;
    color: white;
    font-weight: 600;
  }
`;
const ServiceOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;
const Checkbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  accent-color: #10b981;
`;

const MoreInfoLink = styled.button`
  color: #10b981;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: underline;
`;
const TimeInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const TimeInput = styled.div`
  position: relative;
`;

const TimeInputField = styled(Input)`
  padding-left: 10%;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

interface Props {
  show: boolean;
  handleClose: () => void;
}
export default function BookingForm({ show, handleClose }: Props) {
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "General Repairs",
  ]);

  if (!show) return null;

  const handleServiceChange = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
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
              <div style={{ display: "flex", alignItems: "center" }}>
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
              <div style={{ display: "flex", alignItems: "center" }}>
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
              <div style={{ display: "flex", alignItems: "center" }}>
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
