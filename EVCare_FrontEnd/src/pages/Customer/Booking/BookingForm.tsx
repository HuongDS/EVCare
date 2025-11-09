import React from "react";
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
import type { RootState } from "../../../states/store";
import { useSelector } from "react-redux";
import { LENGTH } from "../../../constants/Code/Constants";
import SpinnerComponent from "../../../components/SpinnerComponent";
import AppointmentPolicySection from "./AppointmentPolicySection";
import NameAndPhoneNumberSection from "./NameAndPhoneNumberSection";
import SelectVehicleSection from "./SelectVehicleSection";
import ServiceSection from "./ServiceSection";
import TimeSection from "./TimeSection";
import Stepper, { Step } from "../../../components/StepperComponent";
import { Modal } from "react-bootstrap";
import { useBookingForm } from "../../../hooks/useBookingForm";

interface Props {
  show: boolean;
  handleClose: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function BookingForm({ show, handleClose, setLoading, loading }: Props) {
  const accountId = useSelector(
    (state: RootState) => state.auth.user?.accountId
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const {
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
    handleSelectVehicle,
    handleSelectServices,
    handleServiceCategoriesChange,
    handleSelectDate,
    handleSelectTime,
    validateStep,
    handleSubmit,
  } = useBookingForm({
    show,
    setLoading,
    handleClose,
    accountId,
    isAuthenticated,
  });

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
          nextButtonText="Next"
          backButtonText="Back"
          hideNextOnLastStep={true}
        >
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
                    <Label>
                      Image (Max: 5 Images; Only send vehicle damage status)
                    </Label>
                    <UploadImage
                      existingImages={files}
                      handleFileRemove={(url) =>
                        setFiles((prev) =>
                          prev.filter((item) => item.url !== url)
                        )
                      }
                      imgQuantity={LENGTH.IMAGES}
                      handleFileSubmit={(file) =>
                        setFiles((prev) => [
                          ...prev,
                          { url: file.url, name: file.name ?? "" },
                        ])
                      }
                    />
                  </FormGroup>
                </SubSection>
              </LeftBody>
            </StepContent>
          </Step>

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
                  <p
                    style={{ color: "red", marginTop: "10px", marginBottom: 0 }}
                  >
                    {errors.services}
                  </p>
                )}
              </RightBody>
            </StepContent>
          </Step>

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
                  errors={errors}
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

export default React.memo(BookingForm);
