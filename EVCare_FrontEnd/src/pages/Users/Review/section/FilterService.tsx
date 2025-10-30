import { useMemo, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useGetAllCategory } from "../../../../services/serviceServicesApi";
import type { ServiceCategoryViewModel } from "../../../../models/ServicesModel/ServiceCategoryViewModel";
import ClickSpark from "../../../../components/ClickEffect/ClickEffect";
import SearchBar from "../../../../components/SearchBar/Search";
interface FilterServiceProps {
  selectedServices: number[];
  onSelectService: (serviceId: number) => void;
  selectedRating: number | null;
  onSelectRating: (rating: number | null) => void;
}

export default function FilterService({
  selectedServices,
  onSelectService,
  selectedRating,
  onSelectRating,
}: FilterServiceProps) {
  const { data, isLoading } = useGetAllCategory();
  const [searchKeyword, setSearchKeyword] = useState("");

  const categories = useMemo<ServiceCategoryViewModel[]>(
    () => data?.data ?? [],
    [data]
  );

  const handleSearchChange = (value: string) => setSearchKeyword(value);

  const filteredCategories = useMemo(() => {
    const keyword = searchKeyword.toLowerCase().trim();
    if (!keyword) return categories;
    return categories
      .map((cat) => ({
        ...cat,
        services: cat.services.filter((s) =>
          s.name.toLowerCase().includes(keyword)
        ),
      }))
      .filter((cat) => cat.services.length > 0);
  }, [categories, searchKeyword]);

  if (isLoading) return <Typography>Loading...</Typography>;

  return (
    <ClickSpark
      sparkColor="#16a34a"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <SearchBar
        placeholder="Search service..."
        handleSearchValue={handleSearchChange}
      />
      <Typography variant="h6" margin={2} color="#16a34a" fontWeight={600}>
        Filter by Rating
      </Typography>

      <Box display="flex" gap={1} flexWrap="wrap" marginLeft={2}>
        {[1, 2, 3, 4, 5].map((rating) => {
          const selected = selectedRating === rating;
          return (
            <Chip
              key={rating}
              label={`${rating} ★`}
              clickable
              color={selected ? "success" : "default"}
              variant={selected ? "filled" : "outlined"}
              onClick={() => onSelectRating(selected ? null : rating)}
            />
          );
        })}
      </Box>

      {filteredCategories.length === 0 && (
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
        {filteredCategories.map((cat) => (
          <Box
            display="flex"
            flexDirection="row"
            key={cat.name}
            flexWrap="wrap"
            minWidth="25vw"
          >
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
