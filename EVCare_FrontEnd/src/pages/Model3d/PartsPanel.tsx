import { useMemo, useState } from "react";
import { Box, AlertTriangle } from "lucide-react";
import type {
  PartDamagedModel,
  DataDto,
  PartCategoryViewModel,
} from "../../models/Model3d/Model3d";
import { useAppDispatch } from "../../states/store";
import BackButton from "../../components/Button/BackButton";
import { closeModel3d } from "../../states/uiSlice";
import { Tooltip } from "antd";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import {
  ButtonGroup,
  CategoriesWrapper,
  CategoryBadge,
  CategoryButton,
  CategoryButtonLeft,
  CategoryIcon,
  CategoryName,
  ChevronIcon,
  Container,
  ContentWrapper,
  DamageLevel,
  Header,
  HeaderContent,
  HeaderText,
  IconBox,
  PartContent,
  PartItem,
  PartItemContent,
  PartName,
  PartNameContainer,
  PartsWrapper,
  StatusDot,
  Subtitle,
  Title,
} from "./styles/PartsPanel.styled";

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

interface PartsPanelProps {
  data: DataDto<PartCategoryViewModel<PartDamagedModel>>;
  onSelectPart: (nodeName: string | null) => void;
  selectedPart?: PartDamagedModel | null;
}

export default function PartsPanel({
  data,
  onSelectPart,
  selectedPart = null,
}: PartsPanelProps) {
  const dispatch = useAppDispatch();
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(data?.partCategoryAppointmentViewModels.map((_, i) => i))
  );

  const { nodes } = useGLTF(data?.vehicleModel3DUrl) as unknown as GLTFResult;

  const meshes = useMemo(() => {
    const names = new Set<string>();
    Object.keys(nodes).forEach((nodeName) => {
      if (nodes[nodeName].isMesh) {
        names.add(nodeName);
      }
    });
    return names;
  }, [nodes]);

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
  };

  const totalParts =
    data?.partCategoryAppointmentViewModels?.reduce((sum, cat) => {
      const parts = cat?.damagedPartViewModels ?? [];
      return sum + parts.length;
    }, 0) ?? 0;

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <HeaderContent>
            <IconBox>
              <Box size={30} color="white" />
            </IconBox>
            <HeaderText>
              <ButtonGroup>
                <Title>Parts Damaged</Title>
                <BackButton action={() => dispatch(closeModel3d())} />
              </ButtonGroup>
              <Subtitle>{totalParts} parts available</Subtitle>
            </HeaderText>
          </HeaderContent>
        </Header>

        <CategoriesWrapper>
          {data?.partCategoryAppointmentViewModels?.map((cat, i) => (
            <div key={i}>
              <CategoryButton onClick={() => toggleCategory(i)}>
                <CategoryButtonLeft>
                  <CategoryIcon />
                  <CategoryName>{cat.partCategoryName}</CategoryName>
                  <CategoryBadge>
                    {cat?.damagedPartViewModels?.length || 0}
                  </CategoryBadge>
                </CategoryButtonLeft>
                <ChevronIcon $expanded={expandedCategories.has(i)} />
              </CategoryButton>

              {expandedCategories.has(i) && (
                <PartsWrapper>
                  {cat?.damagedPartViewModels?.map((part, j) => {
                    const isSelected = selectedPart?.nodeName === part.nodeName;
                    const isMissing = !meshes.has(part.nodeName);
                    return (
                      <PartItem
                        key={j}
                        $isSelected={isSelected}
                        $isDisabled={isMissing}
                        $delay={j * 0.05}
                        onClick={(e) => {
                          if (isMissing) {
                            e.stopPropagation();
                          } else {
                            onSelectPart(isSelected ? null : part.nodeName);
                          }
                        }}
                      >
                        <PartItemContent>
                          <StatusDot $isSelected={isSelected} />
                          <PartContent>
                            <PartNameContainer>
                              <PartName $isSelected={isSelected}>
                                {part.partName}
                              </PartName>
                              {isMissing && (
                                <Tooltip
                                  title="This part is not in 3D Model"
                                  placement="top"
                                  color="#00AD4E"
                                >
                                  <AlertTriangle color="#FFCC00" size={20} />
                                </Tooltip>
                              )}
                            </PartNameContainer>
                            {!isMissing && (
                              <DamageLevel>{part.damageLevel}</DamageLevel>
                            )}
                          </PartContent>
                        </PartItemContent>
                      </PartItem>
                    );
                  })}
                </PartsWrapper>
              )}
            </div>
          ))}
        </CategoriesWrapper>
      </ContentWrapper>
    </Container>
  );
}
