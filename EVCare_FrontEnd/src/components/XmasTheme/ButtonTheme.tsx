import { Rainbow, TreePine } from "lucide-react";

interface props {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
}
const ThemeToggleRound = ({ enabled, setEnabled }: props) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      style={{
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: enabled
          ? "linear-gradient(135deg, #00ad4e, #00ad4e)"
          : "linear-gradient(135deg, #ffff, #ffff)",
        boxShadow: enabled
          ? "0 0 15px rgba(55, 211, 16, 0.6), inset 0 0 10px rgba(255,255,255,0.2)"
          : "0 4px 6px rgba(0,0,0,0.3)",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: enabled ? "scale(1.1)" : "scale(1)",
      }}
      title={enabled ? "XmasOff" : "XmasOn"}
    >
      <div
        style={{
          color: "#fff",
          fontSize: "20px",
          transform: enabled ? "rotate(360deg)" : "rotate(0deg)",
          transition: "transform 0.5s ease",
          display: "flex",
        }}
      >
        {enabled ? <TreePine /> : <Rainbow color="#00ad4e" />}
      </div>
    </button>
  );
};

export default ThemeToggleRound;
