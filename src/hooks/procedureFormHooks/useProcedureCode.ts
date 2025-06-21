import { useEffect, useState } from "react";

export function useProcedureCode(departamento, categoria) {
  const [code, setCode] = useState("");
  useEffect(() => {
    if (departamento && categoria) {
      setCode(`${departamento.codigo_departamento}-${categoria.numero_categoria}`);
    } else {
      setCode("");
    }
  }, [departamento, categoria]);
  return code;
}
