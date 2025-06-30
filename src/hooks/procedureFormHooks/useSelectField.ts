import { useMemo } from "react";

export function useSelectField(options: any[], value: string | number, optionKey: string = "codigo") {
  const selected = useMemo(() => {
    if (!value) return null;
    return options.find((opt: any) => String(opt[optionKey]) === String(value)) || null;
  }, [options, value, optionKey]);
  return selected;
}
