export function useFormReset(initialState: any, setFormData: (data: any) => void, setPdfFile?: (file: any) => void, setProcedureCode?: (code: string) => void) {
  return () => {
    setFormData(initialState);
    if (setPdfFile) setPdfFile(null);
    if (setProcedureCode) setProcedureCode("");
  };
}
