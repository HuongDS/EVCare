import { useState } from "react";
import styled from "styled-components";
import {
  Search,
  ArrowLeft,
  User,
  Car,
  Calendar,
  Upload,
  CheckCircle,
  Phone,
  Mail,
  FileText,
  UserPlus,
} from "lucide-react";
import { Select, DatePicker, Upload as AntUpload, message } from "antd";
import type { UploadFile } from "antd";
import {
  useGetAllCustomer,
  useUploadAppointmentImage,
} from "../../../services/staffService";
import { useGetAllServices } from "../../../services/servicesApi";
import { useStaffCreateAppointment } from "../../../services/appointmentServiceApi";
import {
  APPOINTMENT_MESSAGE,
  MSG_TITLE,
} from "../../../constants/messages/Message";
import SuccessModal from "../../../components/StatusModal/SuccessModal";
import FailedModal from "../../../components/StatusModal/FailModal";
import type { FullCustomerInfor } from "../../../models/CustomerModels/FullCustomerInfor";
import { useGetCustomerID } from "../../../services/customerServices";
import { useCreateNewOrder } from "../../../services/orderServiceApi";
import type { Dayjs } from "dayjs";
import { NOT_FOUND_ITEMS } from "../../../components/MessageStyled/MessageStyled";

interface Props {
  onBack: () => void;
}

export default function CreateAppointmentPage({ onBack }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<FullCustomerInfor | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [appointmentDate, setAppointmentDate] = useState<Dayjs>();
  const [note, setNote] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { data: customers } = useGetAllCustomer({
    keyword: searchQuery,
  });
  const { data: services } = useGetAllServices({});

  const filteredCustomers =
    customers?.data?.items.filter(
      (customer) =>
        customer.customerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleCustomerSelect = (customer: FullCustomerInfor) => {
    if (customer.banned) {
      message.error("This customer is banned and cannot book appointments");
      return;
    }
    setSelectedCustomer(customer);
    setSelectedVehicle(null);
    setSearchQuery("");
  };

  const { data: customerDetail } = useGetCustomerID(
    selectedCustomer?.accountId || 0
  );

  //gọi api create appointment
  const { mutateAsync: staffCreateAppointment } = useStaffCreateAppointment();
  const { mutateAsync: createOrder } = useCreateNewOrder();
  const { mutateAsync: uploadImages } = useUploadAppointmentImage();

  const handleSubmit = async () => {
    if (
      !selectedCustomer ||
      !selectedVehicle ||
      selectedServices.length === 0 ||
      !appointmentDate
    ) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("files", file.originFileObj as Blob);
        }
      });

      const Images = await uploadImages(formData);

      const appointmentData = {
        customerId: customerDetail?.data?.id || 0,
        vehicleId: selectedVehicle,
        note: note || "",
        appointment_Date: appointmentDate.add(7, "hour").toISOString(),
        imagesUrls: Images?.data?.map((image) => image.url || ""),
        serviceIds: selectedServices,
      };

      const response = await staffCreateAppointment(appointmentData);

      if (response) {
        const createNewOrderParams = {
          appointmentID: response.appointmentId || 0,
          created_At: new Date().toISOString(),
        };
        await createOrder(createNewOrderParams);
      }
      setModalMessage(APPOINTMENT_MESSAGE.CREATE_APPOINTMENT_SUCCESS);
      setIsSuccess(true);
    } catch (error) {
      setModalMessage((error as Error).message);
      setIsError(true);
    }
  };

  const selectedVehicleData = selectedCustomer?.vehicles.find(
    (v) => v.id === selectedVehicle
  );

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </BackButton>
        <HeaderText>
          <h1>Create New Appointment</h1>
          <p>Search for customer and schedule a service appointment</p>
        </HeaderText>
      </Header>

      <ContentWrapper>
        <LeftPanel>
          <Card>
            <CardTitle>
              <User size={20} />
              Search Customer
            </CardTitle>

            <SearchBox>
              <Search size={20} />
              <SearchInput
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>

            {searchQuery && filteredCustomers.length > 0 ? (
              <CustomerResults>
                {filteredCustomers.slice(0, 5).map((customer) => (
                  <CustomerCard
                    key={customer.accountId}
                    onClick={() => handleCustomerSelect(customer)}
                    $banned={customer.banned}
                  >
                    <CustomerInfo>
                      <CustomerName>
                        {customer.customerName}
                        {customer.banned && <BannedTag>Banned</BannedTag>}
                      </CustomerName>
                      <CustomerDetails>
                        <DetailItem>
                          <Phone size={12} />
                          {customer.phoneNumber}
                        </DetailItem>
                        <DetailItem>
                          <Mail size={12} />
                          {customer.email}
                        </DetailItem>
                      </CustomerDetails>
                    </CustomerInfo>
                    <VehicleCount>
                      {customer.vehicles.length} vehicles
                    </VehicleCount>
                  </CustomerCard>
                ))}
              </CustomerResults>
            ) : (
              selectedCustomer === null && (
                <NOT_FOUND_ITEMS
                  icon={<UserPlus size={40} />}
                  message={"Enter customer information for searching"}
                />
              )
            )}

            {selectedCustomer && (
              <SelectedCustomer>
                <SelectedLabel>Selected Customer</SelectedLabel>
                <SelectedInfo>
                  <div>
                    <strong>{selectedCustomer.customerName}</strong>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      {selectedCustomer.phoneNumber} • {selectedCustomer.email}
                    </div>
                  </div>
                  <RemoveButton onClick={() => setSelectedCustomer(null)}>
                    Change
                  </RemoveButton>
                </SelectedInfo>
              </SelectedCustomer>
            )}
          </Card>

          {selectedCustomer && selectedCustomer.vehicles.length > 0 && (
            <Card>
              <CardTitle>
                <Car size={20} />
                Select Vehicle
              </CardTitle>

              <VehicleList>
                {selectedCustomer.vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    $selected={selectedVehicle === vehicle.id}
                  >
                    <VehicleImage
                      src={
                        vehicle.image ||
                        "https://i.pinimg.com/736x/79/74/12/797412081b120609d902b4966fa435b7.jpg"
                      }
                      alt={vehicle.licensePlate}
                    />
                    <VehicleInfo>
                      <VehicleCategory>{vehicle.categoryName}</VehicleCategory>
                      <VehiclePlate>{vehicle.licensePlate}</VehiclePlate>
                    </VehicleInfo>
                    {selectedVehicle === vehicle.id && (
                      <SelectedBadge>
                        <CheckCircle size={16} />
                      </SelectedBadge>
                    )}
                  </VehicleCard>
                ))}
              </VehicleList>
            </Card>
          )}
        </LeftPanel>

        <RightPanel>
          <Card>
            <CardTitle>
              <Calendar size={20} />
              Appointment Details
            </CardTitle>

            {!selectedCustomer && (
              <EmptyState>
                <User size={48} opacity={0.3} />
                <p>Please select a customer first</p>
              </EmptyState>
            )}

            {selectedCustomer && !selectedVehicle && (
              <EmptyState>
                <Car size={48} opacity={0.3} />
                <p>Please select a vehicle</p>
              </EmptyState>
            )}

            {selectedCustomer && selectedVehicle && (
              <>
                <SummaryBox>
                  <SummaryRow>
                    <SummaryLabel>Customer:</SummaryLabel>
                    <SummaryValue>{selectedCustomer.customerName}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Vehicle:</SummaryLabel>
                    <SummaryValue>
                      {selectedVehicleData?.categoryName} -{" "}
                      {selectedVehicleData?.licensePlate}
                    </SummaryValue>
                  </SummaryRow>
                </SummaryBox>

                <FormSection>
                  <FormItem>
                    <FormLabel>
                      <Calendar size={14} />
                      Appointment Date & Time<Required>*</Required>
                    </FormLabel>
                    <DatePicker
                      showTime
                      format="DD/MM/YYYY HH:mm"
                      style={{ width: "100%" }}
                      size="large"
                      onChange={setAppointmentDate}
                      placeholder="Select date and time"
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel>
                      <FileText size={14} />
                      Services<Required>*</Required>
                    </FormLabel>
                    <Select
                      mode="multiple"
                      placeholder="Select services"
                      style={{ width: "100%" }}
                      size="large"
                      value={selectedServices}
                      onChange={setSelectedServices}
                      options={services?.data?.items?.map((service) => ({
                        label: service.name,
                        value: service.id,
                      }))}
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel>
                      <FileText size={14} />
                      Customer Note (Optional)
                    </FormLabel>
                    <TextArea
                      placeholder="Enter any special instructions or notes..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                    />
                  </FormItem>

                  <FormItem>
                    <FormLabel>
                      <Upload size={14} />
                      Vehicle Images (Optional)
                    </FormLabel>
                    <AntUpload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={({ fileList }) => setFileList(fileList)}
                      beforeUpload={() => false}
                      maxCount={5}
                    >
                      <UploadButton>
                        <Upload size={20} />
                        <div>Upload</div>
                      </UploadButton>
                    </AntUpload>
                  </FormItem>
                </FormSection>

                <ActionButtons>
                  <CancelButton onClick={onBack}>Cancel</CancelButton>
                  <SubmitButton onClick={handleSubmit}>
                    <CheckCircle size={20} />
                    Create Appointment
                  </SubmitButton>
                </ActionButtons>
              </>
            )}
          </Card>
        </RightPanel>
        {isSuccess && (
          <SuccessModal
            header={MSG_TITLE.CREATE_APPOINTMENT}
            message={modalMessage}
            action={onBack}
          />
        )}
        {isError && (
          <FailedModal
            header={MSG_TITLE.CREATE_APPOINTMENT + " Failed"}
            message={modalMessage}
            action={() => setIsError(false)}
          />
        )}
      </ContentWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  padding: 32px 20px;
  font-family: "Outfit", sans-serif;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 24px 28px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 2px solid #00ad4e;
  color: #00ad4e;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f8f4;
    transform: translateX(-4px);
  }
`;

const HeaderText = styled.div`
  flex: 1;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #00ad4e;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 14px;
    color: #666;
    margin: 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightPanel = styled.div``;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: fit-content;
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #00ad4e;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;

  svg {
    color: #00ad4e;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }

  svg {
    color: #999;
    flex-shrink: 0;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  font-family: "Outfit", sans-serif;
  color: #333;

  &::placeholder {
    color: #999;
  }
`;

const CustomerResults = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

const CustomerCard = styled.div<{ $banned: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.$banned ? "#ffcdd2" : "#e8f5e9")};
  background: ${(props) => (props.$banned ? "#fff5f5" : "#f8fdf9")};
  border-radius: 10px;
  cursor: ${(props) => (props.$banned ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.$banned ? 0.6 : 1)};
  transition: all 0.3s ease;

  &:hover {
    ${(props) =>
      !props.$banned &&
      `
      border-color: #00ad4e;
      background: #e8f5e9;
      transform: translateX(4px);
    `}
  }
`;

const CustomerInfo = styled.div`
  flex: 1;
`;

const CustomerName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BannedTag = styled.span`
  padding: 2px 8px;
  background: #f44336;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 4px;
`;

const CustomerDetails = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 6px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;

  svg {
    color: #00ad4e;
  }
`;

const VehicleCount = styled.div`
  padding: 6px 12px;
  background: #e8f5e9;
  color: #00ad4e;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
`;

const SelectedCustomer = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: #e8f5e9;
  border: 2px solid #00ad4e;
  border-radius: 12px;
`;

const SelectedLabel = styled.div`
  font-size: 12px;
  color: #00ad4e;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const SelectedInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RemoveButton = styled.button`
  padding: 6px 12px;
  background: white;
  border: 1px solid #00ad4e;
  color: #00ad4e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f1f8f4;
  }
`;

const VehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ad4e;
    border-radius: 10px;
  }
`;

const VehicleCard = styled.div<{ $selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 2px solid ${(props) => (props.$selected ? "#00ad4e" : "#e0e0e0")};
  background: ${(props) => (props.$selected ? "#e8f5e9" : "white")};
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 173, 78, 0.15);
  }
`;

const VehicleImage = styled.img`
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
`;

const VehicleInfo = styled.div`
  flex: 1;
`;

const VehicleCategory = styled.div`
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
`;

const VehiclePlate = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-top: 4px;
`;

const SelectedBadge = styled.div`
  width: 32px;
  height: 32px;
  background: #00ad4e;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;

  p {
    margin-top: 16px;
    font-size: 15px;
  }
`;

const SummaryBox = styled.div`
  background: #f8fdf9;
  border: 2px solid #e8f5e9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;

  &:not(:last-child) {
    border-bottom: 1px solid #e8f5e9;
  }
`;

const SummaryLabel = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 600;
`;

const SummaryValue = styled.div`
  font-size: 14px;
  color: #333;
  font-weight: 700;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
  font-weight: 600;

  svg {
    color: #00ad4e;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  font-family: "Outfit", sans-serif;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ad4e;
    box-shadow: 0 0 0 3px rgba(0, 173, 78, 0.1);
  }
`;

const UploadButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #00ad4e;
  font-size: 13px;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  padding: 16px;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00ad4e;
    color: #00ad4e;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: none;
  background: linear-gradient(135deg, #00ad4e 0%, #00c853 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 173, 78, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 173, 78, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Required = styled.label`
  color: red;
`;
