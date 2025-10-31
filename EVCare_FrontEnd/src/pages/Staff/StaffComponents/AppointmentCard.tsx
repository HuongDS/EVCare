import styled, { keyframes } from "styled-components";
import StatusTag from "../../../components/StatusTags/StatusTag";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";

import { formatDate } from "../../../utils/formatDate";
import ButtonAction from "../../../components/Button/ButtonAction";
import { TriangleAlert } from "lucide-react";
import type {
  TechnicianModel,
  TechnicianSkills,
} from "../../../models/AppointmentsModel/Technician_Appointments_Model";

type AppointmentCardProps = {
  data: StaffAppointmentsDto<TechnicianModel<TechnicianSkills>>;
  onOpenProgress: () => void;
  hasTechnicianOnleave: boolean;
  onOpenReassign: () => void;
};
export default function AppointmentCard({
  data,
  onOpenProgress,
  hasTechnicianOnleave,
  onOpenReassign,
}: AppointmentCardProps) {
  return (
    <>
      <ContainerStyled>
        <HeaderStyled>
          <AppointmentId>
            <div>
              AppointmentID: <span>#{data.id}</span>
            </div>
            <div>
              <StatusTag status={data.status} />
            </div>
          </AppointmentId>

          <CalendarStyled>
            <div>
              <i className="bi bi-calendar2-event"></i>
            </div>
            <div>{formatDate(data.appointmentDate)}</div>
          </CalendarStyled>
        </HeaderStyled>
        <hr />
        <InformationStyled>
          <ImageStyled>
            {data.appointmentImages && data.appointmentImages.length > 0 ? (
              data.appointmentImages
                .slice(0, 1)
                .map((img, i) => <img src={img} key={i} />)
            ) : (
              <img
                src="https://i.pinimg.com/736x/79/74/12/797412081b120609d902b4966fa435b7.jpg"
                alt="no image"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
          </ImageStyled>
          <div>
            <GroupFiled>
              <div>Customer name</div>
              <p>{data.customerName}</p>
            </GroupFiled>
            <GroupFiled>
              <div>Phone number</div>
              <p>{data.phoneNumber ?? "default"}</p>
            </GroupFiled>
          </div>
          <div>
            <GroupFiled>
              <div>Vehicle name</div>
              <p>{data.vehicleModel}</p>
            </GroupFiled>
            <GroupFiled>
              <div>License Plate</div>
              <p>{data.licensePlate}</p>
            </GroupFiled>
          </div>
          <GroupFiled>
            <div>Services</div>
            {data.services.slice(0, 3).map((service, i) => (
              <p style={{ fontSize: "1rem" }} key={i}>
                {service.name}
              </p>
            ))}
          </GroupFiled>
          <GroupButtonStyled>
            {data.status === "Done" ? (
              <ButtonAction
                text="View Details"
                color="white"
                backgroundColor="#00AD4E"
                action={onOpenProgress}
              />
            ) : data.status !== "Pending" && data.status !== "Canceled" ? (
              data.status === "AddingPart" ? (
                <WaitingText>Technicians are adding parts...</WaitingText>
              ) : (
                <ButtonAction
                  text="Progress"
                  color="white"
                  backgroundColor="#00AD4E"
                  action={onOpenProgress}
                />
              )
            ) : undefined}
            {(data.status === "AddingPart" || data.status === "InProgress") && (
              <ButtonAction
                text="Re-Assign"
                icon={hasTechnicianOnleave ? <TriangleAlert size={16} /> : null}
                color="white"
                backgroundColor={hasTechnicianOnleave ? "#FFC72C" : "#1da1f2"}
                action={onOpenReassign}
              />
            )}
          </GroupButtonStyled>
        </InformationStyled>
      </ContainerStyled>
    </>
  );
}

const ContainerStyled = styled.div`
  border: 1px solid #ccc;
  border-radius: 12px;
  margin: 15px;
  padding: 10px 20px;
  font-family: "outfit", sans-serif;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  &:hover {
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
`;
const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
`;
const AppointmentId = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 1rem;
  div {
    font-size: 19px;
    font-weight: bold;
    span {
      font-weight: 500;
    }
  }
`;
const CalendarStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 1rem;
  font-size: 19px;
`;
const InformationStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;
const ImageStyled = styled.div`
  width: 200px;
  img {
    width: 100%;
    height: 150px;
    object-fit: contain;
  }
`;
const GroupFiled = styled.div`
  font-size: 16px;
  color: #ccc;
  p {
    font-weight: bold;
    font-size: 18px;
    color: black;
  }
`;
const GroupButtonStyled = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  align-items: end;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const WaitingText = styled.p`
  color: #fa8c16;
  font-style: italic;
  font-size: 15px;
  font-weight: 500;
  animation: ${blink} 2s infinite;
`;
