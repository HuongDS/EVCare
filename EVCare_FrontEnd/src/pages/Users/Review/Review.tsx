import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getAllReview } from "../../../services/reviewService";
import { useGetAllCategory } from "../../../services/serviceServicesApi";
import FilterService from "./section/FilterService";
import ReviewSection from "./section/ReviewSection";
import type { ReviewResponseDto } from "../../../models/Review/ReviewResponseDto";
import * as S from "./Review.styled";
import Banner from "./section/Banner";
import ClickSpark from "../../../components/ClickEffect/ClickEffect";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import SpinnerComponent from "../../../components/SpinnerComponent";

const SORT_ORDER = {
  NEWEST: "newest",
  OLDEST: "oldest",
} as const;
type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export default function ReviewServicePage() {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [allReviews, setAllReviews] = useState<ReviewResponseDto[]>([]);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SORT_ORDER.NEWEST);

  const { isLoading } = useGetAllCategory();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (page: number, reset = false) => {
      try {
        setLoading(true);
        const res = await getAllReview(
          page,
          pageSize,
          selectedRating,
          selectedServices
        );
        const items = res.data?.items ?? [];

        if (reset) {
          setAllReviews(items);
        } else {
          setAllReviews((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newOnes = items.filter((it) => !ids.has(it.id));
            return [...prev, ...newOnes];
          });
        }

        setHasMore(items.length === pageSize);
      } catch (error) {
        console.error("fetchPage error:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, selectedRating, selectedServices]
  );

  useEffect(() => {
    setPageIndex(1);
    setHasMore(true);
    fetchPage(1, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedRating, selectedServices, sortOrder, fetchPage]);

  const filteredReviews = useMemo(() => {
    let result = allReviews;

    if (selectedServices.length > 0) {
      result = result.filter((r) =>
        r.services.some((s) => selectedServices.includes(s.id))
      );
    }

    if (selectedRating !== null) {
      result = result.filter((r) => r.rating === selectedRating);
    }

    return [...result].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === SORT_ORDER.NEWEST ? dateB - dateA : dateA - dateB;
    });
  }, [allReviews, selectedServices, selectedRating, sortOrder]);

  useEffect(() => {
    const endIndex = pageIndex * pageSize;
    setReviews(filteredReviews.slice(0, endIndex));
  }, [filteredReviews, pageIndex, pageSize]);

  // --- handleLoadMore
  const handleLoadMore = useCallback(() => {
    const nextPageIndex = pageIndex + 1;
    const start = pageIndex * pageSize;
    const nextItems = filteredReviews.slice(start, start + pageSize);

    if (nextItems.length > 0) {
      setPageIndex(nextPageIndex);
    } else if (hasMore) {
      setPageIndex(nextPageIndex);
    }
  }, [pageIndex, filteredReviews, pageSize, hasMore]);

  useEffect(() => {
    if (pageIndex === 1) return;
    const startIndexForNextPage = (pageIndex - 1) * pageSize;
    if (filteredReviews.length <= startIndexForNextPage && hasMore) {
      fetchPage(pageIndex, false);
    }
  }, [pageIndex, fetchPage, filteredReviews.length, pageSize, hasMore]);

  // --- IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 }
    );
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading, hasMore, handleLoadMore]);

  // --- Handlers filter & sort
  const handleSelectService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectRating = (rating: number | null) => {
    setSelectedRating(rating);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) =>
      prev === SORT_ORDER.NEWEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST
    );
  };

  if (isLoading) return <SpinnerComponent />;

  return (
    <ClickSpark
      sparkColor="#16a34a"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <Banner />

      <S.Container>
        <S.Sidebar>
          <FilterService
            selectedServices={selectedServices}
            onSelectService={handleSelectService}
            selectedRating={selectedRating}
            onSelectRating={handleSelectRating}
          />
        </S.Sidebar>

        <S.MainContent>
          <S.SortWrapper>
            <S.SortButton onClick={toggleSortOrder}>
              {sortOrder === SORT_ORDER.NEWEST ? (
                <>
                  <ArrowDownWideNarrow size={18} /> Newest First
                </>
              ) : (
                <>
                  <ArrowUpNarrowWide size={18} /> Oldest First
                </>
              )}
            </S.SortButton>
          </S.SortWrapper>

          {(selectedServices.length > 0 || selectedRating !== null) && (
            <S.ActiveFilterInfo>
              <span>Filtering by: </span>
              {selectedRating && <span>{selectedRating}★ </span>}
              {selectedServices.length > 0 && (
                <span>{selectedServices.length} services</span>
              )}
            </S.ActiveFilterInfo>
          )}

          <ReviewSection reviews={reviews} />

          {loading && <S.LoadingText>Loading more...</S.LoadingText>}
          <div ref={observerRef} style={{ height: 1 }}></div>

          {!loading && filteredReviews.length === 0 && (
            <S.EndText>No reviews match your filters.</S.EndText>
          )}

          {!hasMore && !loading && filteredReviews.length > 0 && (
            <S.EndText>No more reviews.</S.EndText>
          )}
        </S.MainContent>
      </S.Container>
    </ClickSpark>
  );
}
