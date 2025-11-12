import { Wrench, Calendar, AlertCircle } from "lucide-react";
import {
  PageContainer,
  ContentCard,
  AnimatedIcon,
  Title,
  ProgressSection,
  ProgressLabel,
  ProgressText,
  ExpectedBox,
} from "./styles/UnderMaintenance.styled";

export default function UnderMaintenance() {
  return (
    <PageContainer>
      <ContentCard>
        <AnimatedIcon>
          <Wrench size={60} color="white" />
        </AnimatedIcon>

        <Title>Under Maintenance</Title>

        <ProgressSection>
          <ProgressLabel>
            <AlertCircle size={16} />
            Maintenance in Progress
          </ProgressLabel>
          <ProgressText>Technicians is working hard</ProgressText>
        </ProgressSection>

        <ExpectedBox>
          <Calendar size={16} />
          The technician is repairing the customer’s vehicle, please wait for the next step!
        </ExpectedBox>
      </ContentCard>
    </PageContainer>
  );
}
