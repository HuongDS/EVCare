import { useState, useEffect, useRef, useCallback } from "react";
import { getAllReview } from "../../../services/reviewService";
import FilterService from "./section/FilterService";
import ReviewSection from "./section/ReviewSection";
import type { ReviewResponseDto } from "../../../models/Review/ReviewResponseDto";
import * as S from "./Review.styled";
import Banner from "./section/Banner";
import ClickSpark from "../../../components/ClickEffect/ClickEffect";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import SpinnerComponent from "../../../components/SpinnerComponent";

enum SORT_ORDER {
  NEWEST = "desc",
  OLDEST = "asc",
}

export default function ReviewServicePage() {
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [minRating, setMinRating] = useState<number>(1);
  const [maxRating, setMaxRating] = useState<number>(5);
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<SORT_ORDER>(SORT_ORDER.NEWEST);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pageIndex == 1 || !hasMore) return;
    const fetchMoreReview = async () => {
      try {
        const res = await getAllReview({
          minRating,
          maxRating,
          serviceIds: selectedServices,
          pageSize,
          pageIndex,
          sortField: "CreatedAt",
          sortOrder,
        });
        const items = res.data?.items ?? [];

        setReviews((prev) => {
          const ids = new Set(prev.map((r) => r.id));
          const news = items.filter((r) => !ids.has(r.id));
          return [...prev, ...news];
        });
        setHasMore(items.length === pageSize);
        setPageIndex(res.data.pageIndex);
      } catch (error) {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };
    fetchMoreReview();
  }, [pageIndex]);

  useEffect(() => {
    const fetchResetReview = async () => {
      setReviews([]);
      setPageIndex(1);
      window.scrollTo({ top: 10, behavior: "smooth" });
      try {
        const response = await getAllReview({
          minRating,
          maxRating,
          serviceIds: selectedServices,
          pageSize,
          pageIndex: 1,
          sortField: "CreatedAt",
          sortOrder,
        });
        const items = response.data?.items ?? [];
        setReviews(items);
        setHasMore(items.length === pageSize);
      } catch (error) {
        setHasMore(false);
      }
    };
    fetchResetReview();
  }, [selectedServices, minRating, maxRating, sortOrder]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPageIndex((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 1 }
    );
    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [loading, hasMore, handleLoadMore]);

  const handleSelectService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) =>
      prev === SORT_ORDER.NEWEST ? SORT_ORDER.OLDEST : SORT_ORDER.NEWEST
    );
  };

  if (loading && pageIndex === 1) return <SpinnerComponent />;

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
            selectedMinRating={minRating}
            selectedMaxRating={maxRating}
            onSelectMinRating={setMinRating}
            onSelectMaxRating={setMaxRating}
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

          {(selectedServices.length > 0 || minRating > 1 || maxRating < 5) && (
            <S.ActiveFilterInfo>
              <span>Filtering by: </span>
              {(minRating > 1 || maxRating < 5) && (
                <span>
                  {minRating === maxRating
                    ? `${minRating}★`
                    : `${minRating}★ to ${maxRating}★`}
                </span>
              )}
              {selectedServices.length > 0 && (
                <span> {selectedServices.length} services</span>
              )}
            </S.ActiveFilterInfo>
          )}

          {loading ? <SpinnerComponent /> : <ReviewSection reviews={reviews} />}

          {loading && pageIndex > 1 && (
            <S.LoadingText>Loading more...</S.LoadingText>
          )}
          <div ref={observerRef} style={{ height: 1 }}></div>

          {!loading && reviews.length === 0 && (
            <S.EndText>No reviews match your filters.</S.EndText>
          )}

          {!hasMore && !loading && reviews.length > 0 && (
            <S.EndText>No more reviews.</S.EndText>
          )}
        </S.MainContent>
      </S.Container>
    </ClickSpark>
  );
}
