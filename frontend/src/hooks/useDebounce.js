import { useState, useEffect } from "react";

/**
 * Custom Hook #1: useDebounce
 * Retrasa la actualización de un valor de búsqueda rápida para evitar
 * re-renderizados innecesarios en el catálogo y tablas administrativas.
 */
export function useDebounce(value, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
