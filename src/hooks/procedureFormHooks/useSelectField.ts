import { useMemo } from "react";

export function useSelectField(
  options: Array<Record<string, any>>, 
  value: string | number | null, 
  optionKey: string = "codigo"
) {
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((opt: Record<string, any>) => String(opt[optionKey]) === String(value)) || null;
  }, [options, value, optionKey]);
  return selected;
}
