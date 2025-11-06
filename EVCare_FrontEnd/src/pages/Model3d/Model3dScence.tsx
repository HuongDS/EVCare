import * as THREE from "three";
import { Suspense, useRef } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import type {
  DataDto,
  PartCategoryViewModel,
  PartDamagedModel,
} from "../../models/Model3d/Model3d";
import { Canvas } from "@react-three/fiber";
import ErrorPage from "../Staff/StaffComponents/Error";

const DAMAGE_COLORS: Record<string, string> = {
  NotAssessed: "#FFFFFF",
  Minor: "#EDDD53",
  Moderate: "#EDA853",
  Severe: "#FF5F2E",
  Critical: "#FF0000",
};

interface ModelProps {
  data: DataDto<PartCategoryViewModel<PartDamagedModel>>;
  nodes: Record<string, THREE.Mesh>;
  selectedPart: PartDamagedModel | null;
  onPartClick: (nodeName: string | null) => void;
  hiddenMeshes: string[];
}

export function Model3dScence({
  data,
  nodes,
  selectedPart,
  onPartClick,
  hiddenMeshes,
}: ModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  if (
    typeof nodes === "string" ||
    (nodes as any)?.includes?.("<!DOCTYPE") ||
    nodes?.scene?.type === "Scene"
      ? false
      : (nodes as any)?.isHTMLElement
  ) {
    <ErrorPage />;
  }

  // Tô màu theo damage level
  const damageMap = new Map<string, string>();
  data.partCategoryAppointmentViewModels?.forEach((cat) => {
    cat?.damagedPartViewModels?.forEach((p) => {
      damageMap.set(p.nodeName, p.damageLevel);
    });
  });

  return (
    <>
      <Canvas
        shadows
        gl={{ alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#b1f5a4", 0.2);
        }}
        camera={{ position: [0, -100, 0], fov: 60, up: [0, 0, 1] }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
          <Environment preset="city" />

          <group
            ref={groupRef}
            dispose={null}
            scale={[data.scale.x, data.scale.y, data.scale.z]}
            rotation={[Math.PI / 2, -Math.PI / 2, 0]}
          >
            {Object.entries(nodes).map(([name, mesh]) => {
              if (!(mesh instanceof THREE.Mesh)) return null;
              if (hiddenMeshes.includes(name)) return null;

              const isSelected = selectedPart?.nodeName === name;
              const damageLevel = damageMap.get(name) || "NotAssessed";

              return (
                <mesh
                  key={name}
                  geometry={mesh.geometry}
                  position={mesh.position}
                  rotation={mesh.rotation}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPartClick(isSelected ? null : name);
                  }}
                >
                  <meshStandardMaterial
                    color={isSelected ? "#00FFFF" : DAMAGE_COLORS[damageLevel]}
                    emissive={isSelected ? "#00FFFF" : "#000000"}
                    emissiveIntensity={isSelected ? 0.5 : 0}
                    metalness={0.5}
                    roughness={0.4}
                  />
                </mesh>
              );
            })}
          </group>

          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={10}
            maxDistance={150}
            maxPolarAngle={Math.PI}
          />
        </Suspense>
      </Canvas>
    </>
  );
}
