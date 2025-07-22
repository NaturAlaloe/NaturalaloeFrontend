import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import React from "react";
import useCollaboratorDetail from "../../hooks/collaborator/useCollaboratorDetail";
import CollaboratorRolesList from "../../components/CollaboratorRolesList";
import FullScreenSpinner from "../../components/globalComponents/FullScreenSpinner";
import NoProceduresMessage from "../../components/NoProceduresMessage";

export default function CollaboratorDetail() {
  const { id } = useParams<{ id: string }>();
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { data, loading, error } = useCollaboratorDetail(id || "", refreshKey);

  if (loading) return <FullScreenSpinner />;
  
  // Manejar caso específico de colaborador sin procedimientos
  if (error?.type === 'no_procedures') {
    let nombreCompleto = "Colaborador";
    
    if (error.collaboratorInfo) {
      const { nombre, apellido1, apellido2 } = error.collaboratorInfo;
      nombreCompleto = `${nombre} ${[apellido1, apellido2].filter(Boolean).join(" ")}`.trim();
    }
    
    return (
      <NoProceduresMessage
        collaboratorName={nombreCompleto}
      />
    );
  }
  
  // Manejar otros tipos de errores
  if (error || !data) {
    const errorMessage = error?.message || "No se pudo cargar el colaborador.";
    return (
      <Box sx={{ p: 5, textAlign: "center", color: "red" }}>
        {errorMessage}
      </Box>
    );
  }

  const personal = data.roles[0];
  const apellidos = [data.apellido1, data.apellido2].filter(Boolean).join(" ");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      {/*Cuadro que contiene toda la información completa del colaborador*/}
      <div className="flex flex-row rounded-3xl p-8 w-[100%] max-w-[1400px] bg-white border-2 border-[#2AAC67] shadow-xl">
        {/*cuadro que contiene la información básica del colaborador*/}
        <div className="min-w-80 max-w-96 h-fit mr-8 bg-[#f8fefb] rounded-2xl p-6 border-2 border-[#2AAC67] flex flex-col">
          <h3 className="text-xl font-bold text-[#2AAC67] mb-6 text-center tracking-wide">
            Información del Colaborador
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Cédula
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {data.cedula}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Nombre
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {data.nombre}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Apellidos
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {apellidos}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Puesto
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {personal.puesto}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Departamento
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {personal.departamento}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
                Área
              </label>
              <div className="w-full border border-[#2AAC67] rounded-lg px-4 py-3 bg-white text-[#333] font-medium focus:outline-none focus:ring-2 focus:ring-[#2AAC67] transition-all duration-300 hover:bg-[#E6F3EA]">
                {personal.area}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#2AAC67] mb-6 tracking-wide">
            Roles de Trabajo
          </h2>
          <CollaboratorRolesList
            roles={data.roles}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        </div>
      </div>
    </Box>
  );
}
