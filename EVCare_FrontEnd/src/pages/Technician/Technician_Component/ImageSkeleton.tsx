import { useState } from "react";
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
        src={error ? "https://via.placeholder.com/300x150?text=No+Image" : src}
        alt={alt}
        className={className}
        style={{
          display: loading ? "none" : "block",
          objectFit: "cover",
          width: "100%",
          height: `${height}px`,
          borderRadius: "8px",
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
    </>
  );
}
