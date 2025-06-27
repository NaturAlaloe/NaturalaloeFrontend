import GlobalModal from "../../components/globalComponents/GlobalModal";
import {
  Info,
  Badge,
  Apartment,
  Person,
  CalendarMonth,
  Edit,
} from "@mui/icons-material";

interface Procedure {
  codigo?: string;
  titulo: string;
  revision: string;
  departamento: string;
  responsable: string;
  fecha_vigencia?: string;
  pdf?: string;
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: Procedure | null;
}

export function useDetailsModal() {
  const DetailsModal = ({ isOpen, onClose, procedure }: DetailsModalProps) => (
    <GlobalModal
      open={isOpen}
      onClose={onClose}
      title="Detalles de Procedimiento"
      maxWidth="md"
    >
      {procedure && (
        <div className="flex flex-col items-center py-2">
          <div className="flex flex-col items-center mb-2">
            <div className="bg-[#e8f8f2] rounded-full w-14 h-14 flex items-center justify-center mb-2">
              <Info className="text-[#2AAC67]" style={{ fontSize: 36 }} />
            </div>
            <h2 className="text-xl font-bold text-[#2AAC67] mb-1">
              Detalles de Procedimiento
            </h2>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Procedimiento */}
            <div>
              <h3 className="text-lg font-semibold text-[#2AAC67] mb-3">
                Información del Procedimiento
              </h3>
              <div className="space-y-3">
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <Badge className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Código
                    </div>
                    <div className="text-sm">
                      {procedure.codigo || "No aplica"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <Info className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Título
                    </div>
                    <div className="text-sm">
                      {procedure.titulo}
                    </div>
                  </div>
                </div>
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <Edit className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Versión
                    </div>
                    <div className="text-sm">
                      {procedure.revision}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Información Adicional */}
            <div>
              <h3 className="text-lg font-semibold text-[#2AAC67] mb-3">
                Información Adicional
              </h3>
              <div className="space-y-3">
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <Apartment className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Departamento
                    </div>
                    <div className="text-sm">
                      {procedure.departamento}
                    </div>
                  </div>
                </div>
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <Person className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Responsable
                    </div>
                    <div className="text-sm">
                      {procedure.responsable}
                    </div>
                  </div>
                </div>
                <div className="flex items-center border border-[#2AAC67] rounded-lg px-3 py-2 bg-[#f6fff6]">
                  <CalendarMonth className="text-[#2AAC67] mr-2" />
                  <div>
                    <div className="text-xs font-semibold text-[#2AAC67]">
                      Fecha Vigencia
                    </div>
                    <div className="text-sm">
                      {procedure.fecha_vigencia
                        ? procedure.fecha_vigencia
                            .split("T")[0]
                            .split("-")
                            .reverse()
                            .join("/")
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {procedure.pdf && (
            <div className="pt-6 w-full flex justify-center">
              <a
                href={procedure.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 hover:underline flex items-center"
              >
                Ver documento PDF
              </a>
            </div>
          )}
        </div>
      )}
    </GlobalModal>
  );

  return { DetailsModal };
}
