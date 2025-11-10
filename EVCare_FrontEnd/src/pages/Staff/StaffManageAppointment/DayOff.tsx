import { CalendarX, Clock } from "lucide-react";
import {
  ContentCard,
  DateText,
  FooterNote,
  IconWrapper,
  Message,
  PageContainer,
  Title,
} from "./styles/DayOff.styled";
import { getToday } from "../../../utils/formatDate";

export default function DayOff() {
  const today = getToday();
  return (
    <PageContainer>
      <ContentCard>
        <IconWrapper>
          <CalendarX size={80} />
        </IconWrapper>

        <Title>You're Off Today</Title>

        <DateText>
          <Clock size={20} />
          {today}
        </DateText>

        <Message>
          Today is your day off.
          <br />
          All actions are temporarily disabled.
        </Message>

        <FooterNote>Enjoy your day off</FooterNote>
      </ContentCard>
    </PageContainer>
  );
}
