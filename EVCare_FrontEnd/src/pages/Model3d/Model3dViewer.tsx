import { useState } from "react";
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
import {
  CanvasWrapper,
  Container,
  ErrorContainer,
  ErrorContent,
  LeftPanel,
  LoadingContent,
  LoadingOverlay,
  PopupStyled,
  RightPanel,
} from "./styles/Model3dViewer.styled";

interface Model3dProps {
  data?: number;
}

export default function Model3dViewer({ data }: Model3dProps) {
  const { data: apiResponse, error, isLoading } = useGetPartDamage(data || 0);
  const dispatch = useAppDispatch();
  const [selectedPart, setSelectedPart] = useState<PartDamagedModel | null>(
    null
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingContent>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ColorSpinner />
          </div>
          <div style={{ fontSize: "16px", fontWeight: 600 }}>
            Loading 3D Model...
          </div>
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
            <h2
              style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}
            >
              Failed to Load 3D Model
            </h2>
            <p style={{ fontSize: "14px", color: "#94a3b8" }}>
              We couldn't load the vehicle model. Please check your connection
              and try again.
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
              <strong>Description:</strong>{" "}
              {selectedPart.damageLevel || "No data"}
            </p>
          </PopupStyled>
        )}
      </AnimatePresence>
    </Container>
  );
}
