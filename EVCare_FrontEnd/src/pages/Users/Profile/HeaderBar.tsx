import { useNavigate } from "react-router-dom";

export default function HeaderBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <button className="back-btn" onClick={goBack} aria-label="Go back">
      ← Back
    </button>
  );
}
