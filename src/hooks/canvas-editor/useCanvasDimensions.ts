import { useState, useEffect, useRef } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useCanvasDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  useEffect(() => {
    // Sprawdzenie czy window istnieje (SSR safety)
    if (typeof window === "undefined") {
      return;
    }

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setIsLoading(false);
      }
    };

    // Ustawienie początkowych wymiarów
    updateDimensions();

    // ResizeObserver do śledzenia zmian rozmiaru kontenera
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Obsługa zmiany rozmiaru okna (fallback)
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return { containerRef, dimensions, isLoading };
};
