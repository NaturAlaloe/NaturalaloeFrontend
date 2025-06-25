export function useProcedureFormHandlers(setFormData: (data: any) => void) {
  function getValueOrEmpty(newValue: any, key: string) {
    if (newValue && !Array.isArray(newValue)) return newValue[key] || newValue.id_categoria || newValue.id_responsable || newValue.codigo;
    return "";
  }

  const handleAutocompleteChange = (name: string, value: any, key: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: getValueOrEmpty(value, key),
    }));
  };

  return { handleAutocompleteChange };
}
