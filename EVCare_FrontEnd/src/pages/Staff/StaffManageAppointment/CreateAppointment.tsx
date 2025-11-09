import { useEffect, useState } from "react";
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
import {
  Select,
  DatePicker,
  Upload as AntUpload,
  message,
  notification,
} from "antd";
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
import TextWaitingEffect from "../StaffComponents/TextWaitingEffect";
import type { BlockedDateViewModel } from "../../../models/BlockedDate/BlockedDateViewModel";
import { getBlockedDate } from "../../../services/serviceCenterService";
import dayjs from "dayjs";

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
  const [listBlockedDays, setListBlockedDays] = useState<
    BlockedDateViewModel[]
  >([]);

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
  const {
    mutateAsync: staffCreateAppointment,
    isPending: appointmentCreating,
  } = useStaffCreateAppointment();
  const { mutateAsync: createOrder, isPending: orderCreating } =
    useCreateNewOrder();
  const { mutateAsync: uploadImages, isPending: uploading } =
    useUploadAppointmentImage();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response02 = await getBlockedDate();
        setListBlockedDays(response02.data ?? []);
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to fetch data",
          showProgress: true,
        });
      }
    };
    fetchData();
  }, []);

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
                  height="175px"
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
                {selectedCustomer.vehicles
                  .filter(
                    (veh) =>
                      veh.categoryName !== "Coupe" &&
                      veh.categoryName !== "test" &&
                      veh.categoryName !== "string"
                  )
                  .map((vehicle) => (
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
                        <VehicleCategory>
                          {vehicle.categoryName}
                        </VehicleCategory>
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
                      format="DD/MM/YYYY HH:mm"
                      value={appointmentDate}
                      onChange={(value) => setAppointmentDate(value)}
                      disabledDate={(current) => {
                        const isPast =
                          current &&
                          current.isBefore(dayjs().startOf("day"), "day");
                        const isBlocked = listBlockedDays.some((d) =>
                          current.isSame(dayjs(d.dateTime, "YYYY-MM-DD"), "day")
                        );
                        return !!isPast || !!isBlocked;
                      }}
                      showTime
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement as HTMLElement
                      }
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

                {appointmentCreating || orderCreating || uploading ? (
                  <TextWaitingEffect
                    text="Waiting for processing"
                    fontSize="20px"
                  />
                ) : (
                  <ActionButtons>
                    <CancelButton onClick={onBack}>Cancel</CancelButton>
                    <SubmitButton onClick={handleSubmit}>
                      <CheckCircle size={20} />
                      Create Appointment
                    </SubmitButton>
                  </ActionButtons>
                )}
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

import {
  ActionButtons,
  BackButton,
  BannedTag,
  CancelButton,
  Card,
  CardTitle,
  ContentWrapper,
  CustomerCard,
  CustomerDetails,
  CustomerInfo,
  CustomerName,
  CustomerResults,
  DetailItem,
  EmptyState,
  FormItem,
  FormLabel,
  FormSection,
  Header,
  HeaderText,
  LeftPanel,
  PageContainer,
  RemoveButton,
  Required,
  RightPanel,
  SearchBox,
  SearchInput,
  SelectedBadge,
  SelectedCustomer,
  SelectedInfo,
  SelectedLabel,
  SubmitButton,
  SummaryBox,
  SummaryLabel,
  SummaryRow,
  SummaryValue,
  TextArea,
  UploadButton,
  VehicleCard,
  VehicleCategory,
  VehicleCount,
  VehicleImage,
  VehicleInfo,
  VehicleList,
  VehiclePlate,
} from "./styles/CreateAppointment.styled";
