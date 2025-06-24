import { useMemo } from "react";

interface Departamento {
  codigo_departamento: string;
}
interface Categoria {
  numero_categoria: string;
}

/**
 * Hook para construir el código POE visual y el de API.
 * @param departamento Objeto departamento seleccionado
 * @param categoria Objeto categoría seleccionada
 * @param consecutivo Consecutivo obtenido de la API
 * @returns { codeVisual, codeApi }
 */
export function useProcedureCode(
  departamento: Departamento | null,
  categoria: Categoria | null,
  consecutivo: number | null
) {
  const codeApi = useMemo(() => {
    if (departamento && categoria) {
      return `${departamento.codigo_departamento}-${categoria.numero_categoria}`;
    }
    return "";
  }, [departamento, categoria]);

  const codeVisual = useMemo(() => {
    if (departamento && categoria && consecutivo !== null && consecutivo !== undefined) {
      const consecutivoStr = String(consecutivo).padStart(3, "0");
      return `${departamento.codigo_departamento}-${categoria.numero_categoria}-${consecutivoStr}`;
    } else if (departamento && categoria) {
      return `${departamento.codigo_departamento}-${categoria.numero_categoria}`;
    }
    return "";
  }, [departamento, categoria, consecutivo]);

  return { codeApi, codeVisual };
}
