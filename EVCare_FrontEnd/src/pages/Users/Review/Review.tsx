import { useState, useEffect, useMemo } from "react";
import { getAllReview } from "../../../services/reviewService";
import { useGetAllCategory } from "../../../services/serviceServicesApi";
import FilterService from "./section/FilterService";
import ReviewSection from "./section/ReviewSection";
import SearchBar from "../../../components/SearchBar/Search";
import type { ReviewResponseDto } from "../../../models/Review/ReviewResponseDto";
import * as S from "./Review.styled";

export default function ReviewServicePage() {
  const [selectedServices, setSelectedServices] = useState<number[]>([]); // ✅ nhiều lựa chọn
  const [searchKeyword, setSearchKeyword] = useState("");
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);

  const { isLoading } = useGetAllCategory();

  // ✅ Fetch tất cả review 1 lần
  useEffect(() => {
    (async () => {
      const reviewRes = await getAllReview();
      setReviews(reviewRes.data?.items ?? []);
    })();
  }, []);

  // ✅ Lọc theo nhiều service được chọn
  const filteredByService = useMemo(() => {
    if (selectedServices.length === 0) return reviews;
    return reviews.filter((r) =>
      r.services.some((s) => selectedServices.includes(s.id))
    );
  }, [reviews, selectedServices]);

  const filteredReviews = useMemo(() => {
    const normalizedKeyword = searchKeyword
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    if (!normalizedKeyword) return filteredByService;

    const keywords = normalizedKeyword.split(" "); // tách từng từ khóa

    return filteredByService.filter((r) =>
      r.services.some((s) => {
        const name = s.name.toLowerCase();
        // match nếu tất cả từ khóa đều xuất hiện trong service name
        return keywords.every((kw) => name.includes(kw));
      })
    );
  }, [filteredByService, searchKeyword]);

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
  };

  const handleSelectService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <S.Container>
      <S.Sidebar>
        <FilterService
          selectedServices={selectedServices}
          onSelectService={handleSelectService}
        />
      </S.Sidebar>

      <S.MainContent>
        <SearchBar
          placeholder="Search reviews by service name..."
          handleSearchValue={handleSearchChange}
        />
        <ReviewSection reviews={filteredReviews} />
      </S.MainContent>
    </S.Container>
  );
}
