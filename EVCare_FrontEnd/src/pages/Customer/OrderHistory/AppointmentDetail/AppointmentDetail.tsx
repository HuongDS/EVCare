import CloseButton from "react-bootstrap/CloseButton";
import {
    Backdrop,
    DetailWrapper,
    ModalContent,
    NoteBox,
    OrderModal,
    Row,
    Section,
    ServiceItem,
    ServiceList,
    Status,
    StatusBadge,
    Title,
    TitleID,
    Wrapper,
} from "./AppointmentDetail.styled";
import NameBoxComponent from "../NameBox";
import type {AppointmentViewDetailModel} from "../../../../models/AppointmentsModel/AppointmentViewDetailModel";
import dayjs from "dayjs";

interface Props {
    onClose: () => void;
    open: boolean;
    appointmentId: number;
    data: AppointmentViewDetailModel;
}

export default function AppointmentDetail({onClose, open, appointmentId, data}: Props) {
    if (!open) return;

    return (
        <DetailWrapper>
            <Wrapper $isOpen={open}>
                <Backdrop $isOpen={open} onClick={onClose}/>
                <OrderModal $isOpen={open} onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <Row
                        style={{
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <CloseButton onClick={onClose} style={{position: "absolute", top: 28, right: 10}}/>
                        <TitleID>ID: #{appointmentId}</TitleID>
                        <Status>
                            Status: <StatusBadge status={data?.status || ""}>{data?.status}</StatusBadge>
                        </Status>
                    </Row>
                    <ModalContent>
                        {/* Customer + Staff Info */}
                        <Section>
                            <Title>Information</Title>
                            <Row>
                                <NameBoxComponent label="Customer's Name" name={data.customerName}/>

                                <NameBoxComponent label="Vehicle Model" name={data.vehicleName}/>
                            </Row>
                            <Row>
                                <NameBoxComponent label="Phone" name={data.phoneNumber}/>
                                <NameBoxComponent label="Date" name={dayjs(data.appointmentDate).format("DD/MM/YYYY")}/>
                            </Row>
                            <Row>
                                <NameBoxComponent label="Service Staff" name={data.employeeName}/>
                                {/* <NameBoxComponent label="Technical Staff" name={staffs[1].name} /> */}
                            </Row>

                            <Row>
                                {/* <NameBoxComponent label="Location" name={customer.location} /> */}
                                <NoteBox readOnly value={data.note} placeholder="Note"/>
                            </Row>
                        </Section>

                        <Section>
                            <Title>Service</Title>
                            <ServiceList>
                                {data?.services.map((s) => (
                                    <Row key={s.id}>
                                        <ServiceItem>• {s.name}</ServiceItem>
                                    </Row>
                                ))}
                            </ServiceList>
                            {/* <TotalRow>Total: {total.toLocaleString("vi-VN")}VNĐ</TotalRow> */}
                        </Section>
                    </ModalContent>
                </OrderModal>
            </Wrapper>
        </DetailWrapper>
    );
}
