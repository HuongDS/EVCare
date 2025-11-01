import * as THREE from "three";
import { useEffect } from "react";
// Import thêm Bounds
import { useGLTF, useBounds, Bounds } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type {
  PartDamagedModel,
  DataDto,
  PartCategoryViewModel,
} from "../../models/Model3d/Model3d";

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

const DAMAGE_COLORS: Record<string, string> = {
  NotAssessed: "#FFFFFF",
  Minor: "#EDDD53",
  Moderate: "#EDA853",
  Severe: "#FF5F2E",
  Critical: "#FF0000",
};

interface ModelProps {
  data: DataDto<PartCategoryViewModel<PartDamagedModel>>;
  selectedPart: PartDamagedModel | null;
  onPartClick: (nodeName: string | null) => void;
  hiddenMeshes: string[];
}

export function Model3dScence({
  data,
  selectedPart,
  onPartClick,
  hiddenMeshes,
  ...props
}: ModelProps) {
  const { nodes, materials } = useGLTF(
    data.vehicleModel3DUrl
  ) as unknown as GLTFResult;

  const bounds = useBounds();

  useEffect(() => {
    if (data.vehicleModel3DUrl) {
      useGLTF.preload(data.vehicleModel3DUrl);
    }
  }, [data]);

  useEffect(() => {
    Object.values(materials).forEach((mat) => {
      if (!mat.userData.originalColor) {
        mat.userData.originalColor = mat.color.clone();
      }
      mat.color.set("#fff");
      mat.metalness = 0.5;
      mat.roughness = 0.4;
    });
  }, [materials]);

  useEffect(() => {
    if (!bounds) return;
    if (selectedPart?.nodeName && nodes[selectedPart.nodeName]) {
      bounds.refresh(nodes[selectedPart.nodeName]).clip().fit();
    } else {
      bounds.refresh().fit();
    }
  }, [selectedPart, bounds, nodes]);

  const damageMap = new Map<string, string>();
  data.partCategoryAppointmentViewModels.forEach((cat) => {
    cat?.damagedPartViewModels?.forEach((p) => {
      damageMap.set(p.nodeName, p.damageLevel);
    });
  });
  // Render tất cả mesh (trừ hidden)
  return (
    <Bounds>
      <group scale={[0.005, 0.005, 0.005]} {...props} dispose={null}>
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
              scale={mesh.scale}
              onClick={(e) => {
                e.stopPropagation();
                onPartClick(isSelected ? null : name);
              }}
            >
              <meshStandardMaterial
                color={isSelected ? "#00FFFF" : DAMAGE_COLORS[damageLevel]}
                emissive={isSelected ? "#00FFFF" : "#000000"}
                emissiveIntensity={isSelected ? 0.5 : 0}
              />
            </mesh>
          );
        })}
      </group>
    </Bounds>
  );
}
