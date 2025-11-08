import { useState } from "react";
import styled from "styled-components";
import { Model3dScence } from "./Model3dScence";
import PartsPanel from "./PartsPanel";
import { useGetPartDamage } from "../../services/Model3dService";
import type { PartDamagedModel } from "../../models/Model3d/Model3d";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch } from "../../states/store";
import { closeModel3d } from "../../states/uiSlice";
import ShowButton from "../../components/Button/ShowButton";
import { TriangleAlert } from "lucide-react";
import ColorSpinner from "../Staff/StaffComponents/ColorSpinner";

interface Model3dProps {
  data?: number;
}

export default function Model3dViewer({ data }: Model3dProps) {
  const { data: apiResponse, error, isLoading } = useGetPartDamage(data || 0);
  const dispatch = useAppDispatch();
  const [selectedPart, setSelectedPart] = useState<PartDamagedModel | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingContent>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ColorSpinner />
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Loading 3D Model...</div>
          <div style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>
            Please wait while we prepare your vehicle model
          </div>
        </LoadingContent>
      </LoadingOverlay>
    );
  }

  if (error || !apiResponse?.data || !apiResponse.data.vehicleModel3DUrl) {
    return (
      <>
        <ErrorContainer>
          <ErrorContent>
            <TriangleAlert size={50} />
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>Failed to Load 3D Model</h2>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              We couldn't load the vehicle model. Please check your connection and try again.
            </p>
            <ShowButton text="QUIT" onclick={() => dispatch(closeModel3d())} />
          </ErrorContent>
        </ErrorContainer>
      </>
    );
  }

  const handlePartSelected = (nodeName: string) => {
    const foundPart = apiResponse?.data.partCategoryAppointmentViewModels
      .flatMap((cat) => cat.damagedPartViewModels)
      .find((p) => p.nodeName === nodeName);
    setSelectedPart(foundPart || null);

    if (window.innerWidth <= 768) {
      setIsPanelOpen(false);
    }
  };

  return (
    <Container>
      <LeftPanel $isOpen={isPanelOpen}>
        <PartsPanel
          data={apiResponse?.data}
          onSelectPart={handlePartSelected as (nodeName: string | null) => void}
          selectedPart={selectedPart}
        />
      </LeftPanel>

      <RightPanel>
        <CanvasWrapper>
          <Model3dScence
            data={apiResponse?.data}
            onPartClick={(name) => handlePartSelected(name || "")}
            selectedPart={selectedPart}
            hiddenMeshes={[""]}
          />
        </CanvasWrapper>
      </RightPanel>

      <AnimatePresence>
        {selectedPart && (
          <PopupStyled
            as={motion.div}
            key={selectedPart.id}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h3>{selectedPart.partName}</h3>
            <p>
              <strong>Damage Level:</strong> {selectedPart.damageLevel}
            </p>
            <p>
              <strong>Description:</strong> {selectedPart.damageLevel || "No data"}
            </p>
          </PopupStyled>
        )}
      </AnimatePresence>
    </Container>
  );
}

const PopupStyled = styled.div`
  position: fixed;
  bottom: 20px;
  left: 65%;
  transform: translateX(-50%);
  width: 320px;
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 999;
  font-family: "Outfit", sans-serif;
  color: #333;

  h3 {
    margin: 0;
    color: #00ad4e;
    font-size: 18px;
    font-weight: 600;
  }

  p {
    margin: 6px 0;
    font-size: 14px;
  }
`;
// Styled Components
const Container = styled.div`
  display: grid;
  grid-template-columns: 2fr 5fr;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
`;

const LeftPanel = styled.div<{ $isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(59, 130, 246, 0.2);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5) 50%, transparent);
  }

  @media (max-width: 1024px) {
    flex: 0 0 45%;
  }

  @media (max-width: 768px) {
    flex: 0 0 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease-in-out;
  }
`;

const RightPanel = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  background: #0a0f1e;

  @media (max-width: 768px) {
    flex: 1;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: 50;
`;

const LoadingContent = styled.div`
  text-align: center;
  color: #e2e8f0;
`;

// const Spinner = styled.div`
//   width: 48px;
//   height: 48px;
//   border: 4px solid rgba(59, 130, 246, 0.2);
//   border-top-color: #3b82f6;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;
//   margin: 0 auto 16px;

//   @keyframes spin {
//     to {
//       transform: rotate(360deg);
//     }
//   }
// `;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: "Outfit", sans-serif;
  color: #ef4444;
  text-align: center;
  padding: 32px;
`;

const ErrorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 32px;
  max-width: 500px;
`;

const CanvasWrapper = styled.div`
  width: 100%;
  height: 100%;
  right: 10%;
  position: relative;

  canvas {
    outline: none;
  }
`;
