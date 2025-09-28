export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};
