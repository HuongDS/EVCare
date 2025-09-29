import AppointmentCard from "../Technician_Component/AppointmentCard";
import Navbar from "../Technician_Component/NavBar";
import Input from "../Technician_Component/SearchBar";
import { Title, BarWrapper, Wrapper } from "./Technician_General.styled";

export default function Technician_General_ToDo() {
  return (
    <Wrapper>
      <BarWrapper>
        <Navbar />
        <Input />
      </BarWrapper>
      <Title>Jobs Queue</Title>
      <AppointmentCard />
    </Wrapper>
  );
}
