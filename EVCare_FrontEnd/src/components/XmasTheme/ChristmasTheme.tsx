import { useEffect } from "react";
import "./XmasTheme.css";

export const ChristmasTheme = ({ enabled }: { enabled: boolean }) => {
  useEffect(() => {
    if (!enabled) {
      document.getElementById("snow")?.remove();
      return;
    }

    let snowContainer = document.getElementById("snow");
    if (!snowContainer) {
      snowContainer = document.createElement("div");
      snowContainer.id = "snow";
      document.body.appendChild(snowContainer);
    }

    const createSnowflake = () => {
      if (!enabled) return;
      const snow = document.createElement("div");
      snow.classList.add("snowflake");
      snow.innerText = "❄";
      snow.style.left = Math.random() * 100 + "vw";
      snow.style.animationDuration = Math.random() * 5 + 5 + "s";
      snow.style.opacity = Math.random().toString();
      snowContainer!.appendChild(snow);
      setTimeout(() => snow.remove(), 10000);
    };

    const interval = setInterval(createSnowflake, 200);

    return () => {
      clearInterval(interval);
      document.getElementById("snow")?.remove();
    };
  }, [enabled]);

  return null;
};
