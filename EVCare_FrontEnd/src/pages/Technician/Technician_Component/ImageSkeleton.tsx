import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";

interface ImageSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  height?: number;
}

export default function ImageSkeleton({
  src,
  alt,
  className,
  height = 180,
}: ImageSkeletonProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError(true);
      }
    }, 30000); // after 30 seconds

    return () => clearTimeout(timer);
  }, [loading, src]);

  return (
    <>
      {loading && !error && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height}
          animation="wave"
        />
      )}
      <img
        src={error ? "https://placehold.co/300x180?text=No+Image" : src}
        alt={alt}
        className={className}
        style={{
          display: loading ? "none" : "block",
          objectFit: "cover",
          width: "100%",
          height: `${height}px`,
          borderRadius: "8px",
        }}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </>
  );
}
