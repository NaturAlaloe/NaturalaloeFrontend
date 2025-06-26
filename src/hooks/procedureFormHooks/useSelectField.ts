import { useMemo } from "react";

export function useSelectField(options, value, optionKey = "codigo") {
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((opt) => String(opt[optionKey]) === String(value)) || null;
  }, [options, value, optionKey]);
  return selected;
}
