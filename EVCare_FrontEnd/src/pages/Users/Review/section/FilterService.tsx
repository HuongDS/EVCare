import { useMemo } from "react";
import { Box, Chip, Typography, Divider } from "@mui/material";
import { useGetAllCategory } from "../../../../services/serviceServicesApi";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";

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
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
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
            color="#00ad4e"
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
  );
}
