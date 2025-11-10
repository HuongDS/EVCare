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
} from "./styles/MainteningPage.styled";

export default function MainteningPage() {
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
          We will back soon
        </ExpectedBox>
      </ContentCard>
    </PageContainer>
  );
}
