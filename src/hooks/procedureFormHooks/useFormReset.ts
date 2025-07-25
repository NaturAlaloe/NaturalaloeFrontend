export function useFormReset(initialState: any, setFormData: (data: any) => void, resetPdfInput?: () => void, setProcedureCode?: (code: string) => void) {
  return () => {
    setFormData(initialState);
    if (resetPdfInput) resetPdfInput();
    if (setProcedureCode) setProcedureCode("");
  };
}
