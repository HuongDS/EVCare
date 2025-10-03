import styled from "styled-components";
import TextAreaDisabled from "../../../components/TextField/TextAreaDisabled";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";

const CheckInWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 10px 30px;
  font-family: "Outfit", sans-serif;
`;

const CustomerInformation = styled.div`
  span {
    font-weight: bold;
  }
`;

const GroupFiled = styled.div`
  font-size: 16px;
  color: #ccc;
  p {
    font-weight: bold;
    font-size: 18px;
    color: black;
    margin-bottom: 10px;
  }
`;

const ServiceGroup = styled.div`
  h5 {
    font-weight: bold;
  }
`;
const Services = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const ImageGroup = styled.div`
  display: flex;
  gap: 20%;
  img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }
`;

interface props {
  data: StaffAppointmentsDto;
}
export default function Appointment_CheckIn({ data }: props) {
  return (
    <CheckInWrapper>
      <CustomerInformation>
        <h5>
          Appointment ID: <span>#{data.id}</span>
        </h5>
        <GroupFiled>
          <div>Customer name</div>
          <p>{data.customerName}</p>
        </GroupFiled>
        <GroupFiled>
          <div>Vehicle Model</div>
          <p>{data.vehicleModel}</p>
        </GroupFiled>
        <GroupFiled>
          <div>License Plate</div>
          <p>{data.licensePlate}</p>
        </GroupFiled>
        <GroupFiled>
          <div>Phone Number</div>
          <p>{data.phoneNumber}</p>
        </GroupFiled>
      </CustomerInformation>
      <ServiceGroup>
        <h5>Services</h5>
        <Services>
          {data.services.map((service, index) => (
            <p>
              {index + 1}. {service}
            </p>
          ))}
        </Services>
      </ServiceGroup>
      <ImageGroup>
        {data?.vehicleImageUrl?.map((img, i) => (
          <img src={img} alt={`image + ${i + 1}`} />
        ))}
      </ImageGroup>
      <div>
        <div>
          <TextAreaDisabled value={data.note} />
        </div>
      </div>
    </CheckInWrapper>
  );
}
