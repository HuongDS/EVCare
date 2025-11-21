import { useEffect, useState } from "react";
import { Box, Chip, Slider, Typography } from "@mui/material";
import { getAllServices } from "../../../../services/serviceServicesApi";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";
import ClickSpark from "../../../../components/ClickEffect/ClickEffect";
interface FilterServiceProps {
  selectedServices: number[];
  onSelectService: (serviceId: number) => void;
  selectedMinRating: number;
  selectedMaxRating: number;
  onSelectMinRating: (rating: number) => void;
  onSelectMaxRating: (rating: number) => void;
}

export default function FilterService({
  selectedServices,
  onSelectService,
  selectedMinRating,
  selectedMaxRating,
  onSelectMinRating,
  onSelectMaxRating,
}: FilterServiceProps) {
  const [categories, setCategories] = useState<ServiceCategoryViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getAllServices();
        setCategories(response?.data ?? []);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRatingChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      onSelectMinRating(newValue[0]);
      onSelectMaxRating(newValue[1]);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <ClickSpark sparkColor="#16a34a" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <Typography variant="h6" margin={2} color="#16a34a" fontWeight={600}>
        Filter by Rating
      </Typography>

      <Box sx={{ width: "auto", marginX: 3, marginTop: 1 }}>
        <Slider
          value={[selectedMinRating, selectedMaxRating]}
          onChange={handleRatingChange}
          min={1}
          max={5}
          step={1}
          marks={[
            { value: 1, label: "1★" },
            { value: 2, label: "2★" },
            { value: 3, label: "3★" },
            { value: 4, label: "4★" },
            { value: 5, label: "5★" },
          ]}
          valueLabelDisplay="auto"
          disableSwap
          sx={{
            color: "#16a34a",
            "& .MuiSlider-thumb": {
              backgroundColor: "#16a34a",
            },
            "& .MuiSlider-track": {
              backgroundColor: "#16a34a",
            },
          }}
        />
      </Box>

      {categories.length === 0 && (
        <Typography variant="body2" color="text.secondary" mt={2}>
          No services found.
        </Typography>
      )}
      <Typography variant="h6" margin={2} color="#16a34a" fontWeight={600}>
        Services
      </Typography>

      <Box
        fontFamily={"Outfit, sans-serif"}
        display="flex"
        flexDirection="column"
        marginTop="16px"
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: 3,
          },
        }}
      >
        {categories.map((cat) => (
          <Box display="flex" flexDirection="row" key={cat.name} flexWrap="wrap" minWidth="25vw">
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
                    fontSize: "0.8rem",
                    borderRadius: "50px",
                    textTransform: "capitalize",
                    transition: "all 0.2s ease",
                    margin: "4px",
                    backgroundColor: selected ? "#16a34a" : "#16a34a22",
                    color: selected ? "#fff" : "#000",
                    "&:hover": {
                      backgroundColor: selected ? "#16a34a" : "#16a34a33",
                    },
                  }}
                />
              );
            })}
          </Box>
        ))}
      </Box>
    </ClickSpark>
  );
}
