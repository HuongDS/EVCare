import StatusTag from "../../../../components/StatusTags/StatusTag";
import Car from "../../../../assets/EVcar.webp";
import ButtonAction from "../../../../components/Button/ReviewButton";
import {
  ButtonStyle,
  Container,
  ContentWrapper,
  CustomerInformation,
  DateStyled,
  GeneralStyled,
  IDWrapper,
  ImageWrapper,
  ListItem,
  ServiceWrapper,
} from "./AppointmentHistoryCard.styled";
import type { AppointmentViewModel } from "../../../../models/AppointmentsModel/AppointmentViewModel";
import dayjs from "dayjs";
import { List } from "antd";

interface props {
  data: AppointmentViewModel;
  onViewAppointmentDetail: (appointmentId: number) => void;
}

export default function OrderHistoryCard({
  data,
  onViewAppointmentDetail,
}: props) {
  return (
    <Container>
      <IDWrapper>
        <h5>
          ID <span>#{data.id}</span>
        </h5>
      </IDWrapper>
      <GeneralStyled>
        <DateStyled>
          <h5>
            Date:{" "}
            <span>{dayjs(data.appointmentDate).format("DD/MM/YYYY")}</span>
          </h5>
          <div>
            <StatusTag status={data.status} />
          </div>
        </DateStyled>
        <h5>{data.vehicleModel}</h5>
      </GeneralStyled>
      <ContentWrapper>
        <CustomerInformation>
          <ImageWrapper>
            <img src={data.vehicleImageUrl ? data.vehicleImageUrl[0] : Car} alt="" />
          </ImageWrapper>
          <ServiceWrapper>
            <List>
              {data.services.map((s, i) => (
                <ListItem key={i}>{s}</ListItem>
              ))}
            </List>
          </ServiceWrapper>
        </CustomerInformation>
        <ButtonStyle>
          <ButtonAction
            text="View Detail"
            color="white"
            backgroundColor="#00ad4e"
            action={() => onViewAppointmentDetail(62)}
          />
        </ButtonStyle>
      </ContentWrapper>
    </Container>
  );
}
