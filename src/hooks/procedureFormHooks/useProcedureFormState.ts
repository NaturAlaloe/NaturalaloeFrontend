import { useState, type ChangeEvent } from "react";

export function useProcedureFormState(initialState: any) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { formData, setFormData, handleChange };
}
