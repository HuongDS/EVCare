import styled from "styled-components";
import StatusTag from "../../../components/StatusTags/StatusTag";
import type { StaffAppointmentsDto } from "../../../models/AppointmentsModel/Staff_Appointments_Model";

import { formatDate } from "../../../utils/formatDate";
import ButtonAction from "../../../components/Button/ReviewButton";
import Appoinment_Progress_Modal from "../StaffManageAppointment/Appoinment_Progress_Modal";
import { useState } from "react";
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
type AppointmentCardProps = {
  data: StaffAppointmentsDto;
};
export default function AppointmentCard({ data }: AppointmentCardProps) {
  const [show, setShow] = useState(false);

  const handleShowProgress = () => {
    setShow(true);
  };

  const handleCloseProgress = () => {
    setShow(false);
  };
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
            <img
              src="https://th.bing.com/th/id/OSK.HERO8JB9i-Vk9dE32vQgHmNtC51-a4Zd2M1_ENbXWgtZvbk?w=472&h=280&c=1&rs=2&o=6&dpr=1.3&pid=SANGAM"
              alt=""
            />
          </ImageStyled>
          <div>
            <GroupFiled>
              <div>Customer name</div>
              <p>{data.customerName}</p>
            </GroupFiled>
            <GroupFiled>
              <div>Phone number</div>
              <p>{data.phoneNumber}</p>
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
            {data.services.slice(0, 3).map((service) => (
              <p style={{ fontSize: "1rem" }}>{service}</p>
            ))}
          </GroupFiled>
          <GroupButtonStyled>
            {data.status === "Done" ? (
              <ButtonAction
                text="View Details"
                color="white"
                backgroundColor="#1da1f2"
                action={handleShowProgress}
              />
            ) : (
              <ButtonAction
                text="Progress"
                color="white"
                backgroundColor="#00AD4E"
                action={handleShowProgress}
              />
            )}
          </GroupButtonStyled>
        </InformationStyled>
      </ContainerStyled>
      <Appoinment_Progress_Modal
        show={show}
        close={handleCloseProgress}
        data={data}
      />
    </>
  );
}
