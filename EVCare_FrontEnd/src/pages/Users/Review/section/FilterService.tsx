import { useMemo } from "react";
import { Box, Chip, Typography, Divider } from "@mui/material";
import { useGetAllCategory } from "../../../../services/serviceServicesApi";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";
import ClickSpark from "../../../../components/ClickEffect/ClickEffect";

interface FilterServiceProps {
  selectedServices: number[];
  onSelectService: (serviceId: number) => void;
}

export default function FilterService({
  selectedServices,
  onSelectService,
}: FilterServiceProps) {
  const { data, isLoading } = useGetAllCategory();

  const categories = useMemo<ServiceCategoryViewModel[]>(() => {
    return data?.data ?? [];
  }, [data]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <ClickSpark
      sparkColor="#16a34a"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <Box
        fontFamily={"Outfit, sans-serif"}
        display="flex"
        flexDirection="column"
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        {categories.map((cat, idx) => (
          <Box key={idx} mb={2}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="#16a34a"
              mb={1}
            >
              {cat.name}
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1}>
              {cat.services.map((s) => {
                const selected = selectedServices.includes(s.id);
                return (
                  <Chip
                    key={s.id}
                    label={s.name}
                    clickable
                    color={selected ? "success" : "default"}
                    variant={selected ? "filled" : "outlined"}
                    onClick={() => onSelectService(s.id)}
                    sx={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      borderRadius: "8px",
                      textTransform: "capitalize",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: selected ? "#16a34a" : "#16a34a33",
                      },
                    }}
                  />
                );
              })}
            </Box>

            {idx < categories.length - 1 && (
              <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.1)" }} />
            )}
          </Box>
        ))}
      </Box>
    </ClickSpark>
  );
}
