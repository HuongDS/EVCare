import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      document.documentElement.style.scrollBehavior = "auto";
    } catch (e) {}

    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      try {
        document.documentElement.style.scrollBehavior = "smooth";
      } catch (e) {}
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
