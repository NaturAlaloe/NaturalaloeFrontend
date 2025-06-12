import { useState } from "react";

export interface Version {
  revision: string;
  fechaVigencia: string;
  pdfUrl: string;
}

export interface PoeRow {
  codigo: string;
  titulo: string;
  departamento: string;
  responsable: string;
  versiones: Version[];
}

export type SelectedRevisionState = {
  [codigo: string]: number;
};

const poesConVersiones: PoeRow[] = [
  {
    codigo: "POE-001",
    titulo: "Limpieza de equipos",
    departamento: "Producción",
    responsable: "Juan Pérez",
    versiones: [
      { revision: "1.0", fechaVigencia: "2023-01-01", pdfUrl: "/docs/poe-001-v1.pdf" },
      { revision: "2.0", fechaVigencia: "2024-01-01", pdfUrl: "/docs/poe-001-v2.pdf" },
    ],
  },
  {
    codigo: "POE-002",
    titulo: "Control de calidad",
    departamento: "Calidad",
    responsable: "Ana Gómez",
    versiones: [
      { revision: "1.0", fechaVigencia: "2022-06-15", pdfUrl: "/docs/poe-002-v1.pdf" },
      { revision: "1.1", fechaVigencia: "2023-07-10", pdfUrl: "/docs/poe-002-v1-1.pdf" },
    ],
  },
  {
    codigo: "POE-003",
    titulo: "Manejo de residuos",
    departamento: "Medio Ambiente",
    responsable: "Carlos Ruiz",
    versiones: [
      { revision: "1.0", fechaVigencia: "2021-03-10", pdfUrl: "/docs/poe-003-v1.pdf" },
      { revision: "1.1", fechaVigencia: "2022-04-15", pdfUrl: "/docs/poe-003-v1-1.pdf" },
      { revision: "2.0", fechaVigencia: "2023-09-01", pdfUrl: "/docs/poe-003-v2.pdf" },
    ],
  },
  {
    codigo: "POE-004",
    titulo: "Almacenamiento de materiales",
    departamento: "Logística",
    responsable: "María López",
    versiones: [
      { revision: "1.0", fechaVigencia: "2020-11-20", pdfUrl: "/docs/poe-004-v1.pdf" },
      { revision: "1.1", fechaVigencia: "2021-12-05", pdfUrl: "/docs/poe-004-v1-1.pdf" },
      { revision: "2.0", fechaVigencia: "2022-10-10", pdfUrl: "/docs/poe-004-v2.pdf" },
      { revision: "2.1", fechaVigencia: "2023-12-01", pdfUrl: "/docs/poe-004-v2-1.pdf" },
    ],
  },
  {
    codigo: "POE-005",
    titulo: "Mantenimiento preventivo",
    departamento: "Mantenimiento",
    responsable: "Pedro Sánchez",
    versiones: [
      { revision: "1.0", fechaVigencia: "2021-01-15", pdfUrl: "/docs/poe-005-v1.pdf" },
      { revision: "1.1", fechaVigencia: "2022-02-20", pdfUrl: "/docs/poe-005-v1-1.pdf" },
      { revision: "2.0", fechaVigencia: "2023-03-30", pdfUrl: "/docs/poe-005-v2.pdf" },
    ],
  },
  // Puedes agregar más POEs aquí para pruebas
];

export function useVersionControlProcedures() {
  const [filterText, setFilterText] = useState("");
  const [selectedRevision, setSelectedRevision] = useState<SelectedRevisionState>({});

  const filteredPoes = poesConVersiones.filter(
    (poe) =>
      poe.codigo.toLowerCase().includes(filterText.toLowerCase()) ||
      poe.titulo.toLowerCase().includes(filterText.toLowerCase()) ||
      poe.departamento.toLowerCase().includes(filterText.toLowerCase()) ||
      poe.responsable.toLowerCase().includes(filterText.toLowerCase())
  );

  return {
    poes: filteredPoes,
    filterText,
    setFilterText,
    selectedRevision,
    setSelectedRevision,
  };
}
