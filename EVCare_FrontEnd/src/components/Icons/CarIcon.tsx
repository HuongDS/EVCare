import React from "react";

const CarIcon: React.FC = () => (
  <svg
    width="60"
    height="30"
    viewBox="0 0 60 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleX(-1)" }}
  >
    <rect x="0" y="10" width="50" height="15" rx="5" fill="#00ad4e" />
    <path d="M10 10 C10 5 15 5 20 5 L35 5 C40 5 45 5 45 10 L10 10 Z" fill="#2d3748" />
    <rect x="15" y="6" width="10" height="4" rx="2" fill="#a0aec0" />
    <rect x="27" y="6" width="15" height="4" rx="2" fill="#a0aec0" />
    <circle cx="15" cy="25" r="5" fill="#2d3748" />
    <circle cx="40" cy="25" r="5" fill="#2d3748" />
    <circle cx="15" cy="25" r="2" fill="#cbd5e0" />
    <circle cx="40" cy="25" r="2" fill="#cbd5e0" />
  </svg>
);

export default CarIcon;
