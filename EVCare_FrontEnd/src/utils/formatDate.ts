export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateNoTime = (dateString?: string) => {
  if (!dateString) return new Date().toLocaleDateString("vi-VN");
  return dateString;
};

export const getToday = () => {
  const today = new Date().toLocaleDateString("us-EN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return today;
};
