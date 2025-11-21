import { useState, useEffect } from "react";
import Skeleton from "@mui/material/Skeleton";

interface ImageSkeletonProps {
  src?: string | null;
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
    setLoading(true);
    setError(false);
  }, [src]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError(true);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [loading, src]);

  const finalSrc =
    error || !src ? "https://placehold.co/300x180?text=No+Image" : src;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {loading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={height}
          animation="wave"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${height}px`,
            borderRadius: "8px",
          }}
        />
      )}

      <img
        src={finalSrc}
        alt={alt}
        className={className}
        style={{
          objectFit: "cover",
          width: "100%",
          height: `${height}px`,
          borderRadius: "8px",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </div>
  );
}
