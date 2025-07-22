import { useState } from "react";
import TrainingModal from "./TrainingModal";
import type { ICollaboratorDetailRole } from "../services/manage/collaboratorService";
import { useParams } from "react-router-dom";

interface CollaboratorRolesListProps {
  roles: ICollaboratorDetailRole[];
  onRefresh?: () => void;
}

export default function CollaboratorRolesList({
  roles,
  onRefresh,
}: CollaboratorRolesListProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { id: id_colaborador } = useParams<{ id: string }>();

  const handleClick = (role: string) => {
    setOpen((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleOpenModal = (row: any) => {
    const modalDataToSet = {
      ...row,
      id_colaborador: Number(id_colaborador),
      id_documento_normativo: row.id_documento,
    };

    setModalData(modalDataToSet);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData(null);
    // No refrescar automáticamente al cerrar - solo al guardar exitosamente
  };

  const handleSuccessfulSave = () => {
    // Refrescar solo cuando se guarde exitosamente
    if (typeof onRefresh === "function") {
      onRefresh();
    }
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl shadow-lg border-2 border-[#2AAC67] transition-shadow duration-300 hover:shadow-xl overflow-hidden">
        {roles.map((role, roleIndex) => (
          <div key={role.nombre_rol}>
            {/* Botón de cada rol */}
            <button
              onClick={() => handleClick(role.nombre_rol)}
              className={`w-full py-4 px-6 flex items-center justify-between text-left transition-all duration-300 hover:bg-[#E6F3EA] hover:translate-x-2 ${
                roleIndex === 0 ? "rounded-t-2xl" : ""
              } ${
                roleIndex === roles.length - 1 && !open[role.nombre_rol]
                  ? "rounded-b-2xl"
                  : ""
              }`}
            >
              <span className="font-bold text-black text-lg tracking-wide">
                {role.nombre_rol}
              </span>
              <div className="text-[#2AAC67]">
                {open[role.nombre_rol] ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            </button>

            {/* Contenido colapsable */}
            {open[role.nombre_rol] && (
              <div
                className={`mx-4 my-2 bg-white rounded-xl border-2 border-[#2AAC67] shadow-md animate-fadeIn ${
                  roleIndex === roles.length - 1 ? "mb-4" : ""
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2AAC67] tracking-wide border-b border-[#2AAC67] first:rounded-tl-xl last:rounded-tr-xl">
                          POE
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2AAC67] tracking-wide border-b border-[#2AAC67]">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-[#2AAC67] tracking-wide border-b border-[#2AAC67]">
                          Versión
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2AAC67] tracking-wide border-b border-[#2AAC67]">
                          Fecha de inducción
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-[#2AAC67] tracking-wide border-b border-[#2AAC67] first:rounded-tl-xl last:rounded-tr-xl">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(role.poes || []).map((row, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors duration-300 hover:bg-[#F0F8F2] border-b border-gray-100 last:border-b-0 ${
                            idx === 0 ? "hover:rounded-t-xl" : ""
                          } ${
                            idx === (role.poes || []).length - 1
                              ? "hover:rounded-b-xl"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {row.codigo}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {row.descripcion}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800 text-center">
                            {Math.floor(Number(row.version))}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {row.fecha_inicio
                              ? (() => {
                                  // Crear fecha sin interpretación de zona horaria
                                  const fechaParts =
                                    row.fecha_inicio.split("-");
                                  if (fechaParts.length === 3) {
                                    const fecha = new Date(
                                      parseInt(fechaParts[0]),
                                      parseInt(fechaParts[1]) - 1,
                                      parseInt(fechaParts[2])
                                    );
                                    return fecha.toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    });
                                  } else {
                                    // Fallback para formatos de fecha con hora
                                    const fecha = new Date(
                                      row.fecha_inicio + "T00:00:00"
                                    );
                                    return fecha.toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                    });
                                  }
                                })()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {row.estado_capacitacion === "Capacitado" ? (
                                <svg
                                  className="w-6 h-6 text-[#2AAC67]"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : (
                                <>
                                  <svg
                                    className="w-6 h-6 text-red-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <button
                                    onClick={() => handleOpenModal(row)}
                                    className="bg-[#2AAC67] hover:bg-[#1F8A50] text-white font-bold py-2 px-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {(role.poes || []).length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-500 text-sm"
                          >
                            No hay registros de procedimientos para este rol.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de capacitación */}
      <TrainingModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccessfulSave}
        initialData={modalData}
      />
    </>
  );
}
