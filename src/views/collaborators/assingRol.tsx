import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import useCollaborators from '../../hooks/collaborator/useCollaboratorsAssign';
import useRoles from '../../hooks/collaborator/useRols';
import TableRol from '../../components/globalComponents/TableRol';
import InputField from '../../components/formComponents/InputField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import CustomToaster, { showCustomToast } from '../../components/globalComponents/CustomToaster';

export default function AssignRol() {
  // Hooks personalizados
  const { collaborators, loading, error, searchTerm, setSearchTerm } = useCollaborators();
  const { 
    roles, 
    loadingRoles, 
    errorRoles, 
    rolesSeleccionados,
    colaboradorSeleccionado,
    handleColaboradorSeleccion,
    handleRolSeleccion,
    clearColaboradorSeleccion,
    processRoleChanges
  } = useRoles();

  // Manejar cambio en el campo de búsqueda
  const manejarCambioBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const valor = evento.target.value;
    setSearchTerm(valor);
    
    if (colaboradorSeleccionado) {
      clearColaboradorSeleccion();
    }
  };

  // Manejar selección de colaborador desde la lista
  const manejarSeleccionDesdeResultados = (colab: any) => {
    handleColaboradorSeleccion(
      colab.id_colaborador,
      colab.nombre,
      colab.apellido1,
      colab.apellido2,
      colab.cedula,
      colab.puesto
    );
    setSearchTerm('');
  };

  // Manejar asignación y desasignación de roles
  const manejarAsignarRoles = async () => {
    try {
      await processRoleChanges();
      showCustomToast('Éxito', 'Roles actualizados correctamente', 'success');
    } catch (error: any) {
      const mensaje = error.message || 'Error al actualizar los roles';
      const tipo = mensaje.includes('selecciona') || mensaje.includes('cambios') ? 'info' : 'error';
      showCustomToast(mensaje, undefined, tipo);
      console.error('Error al procesar roles:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff] to-white px-0 py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out">
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-2 mb-4">
        <div className="flex w-full justify-center mb-8">
          <h1 className="text-4xl font-black text-[#2BAC67] text-center font-[Poppins]">
            Asignación de Roles
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          {/* Buscador de colaboradores */}
          <div className="mb-6">
            <InputField
              name="busqueda"
              value={searchTerm}
              onChange={manejarCambioBusqueda}
              placeholder="Buscar por nombre o cédula"
              className="w-full"
            />
          </div>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Resultados de búsqueda */}
          {searchTerm && !colaboradorSeleccionado && (
            <div className={`mb-6 overflow-y-auto bg-gray-50 rounded-lg p-4 border ${
              loading || (!collaborators || collaborators.length === 0) ? 'h-32' : 'max-h-80'
            }`}>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <CircularProgress />
                </div>
              ) : !collaborators || collaborators.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500 text-center">
                    {searchTerm ? `No se encontraron colaboradores con "${searchTerm}"` : 'Cargando...'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {collaborators
                    .filter(colab => colab && typeof colab.id_colaborador === 'string')
                    .map(colab => (
                      <div
                        key={colab.id_colaborador}
                        onClick={() => manejarSeleccionDesdeResultados(colab)}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#2BAC67] hover:bg-[#E6F3EA] cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="font-bold text-[#2BAC67] text-lg">
                            {colab.cedula || 'Sin cédula'}
                          </div>
                          <div className="text-gray-700 font-medium">
                            {[colab.nombre, colab.apellido1, colab.apellido2].filter(Boolean).join(' ').trim() || 'Sin nombre'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {colab.puesto || 'Sin puesto'}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Información del colaborador seleccionado */}
          {colaboradorSeleccionado && (
            <div className="mb-6 p-4 bg-[#E6F3EA] rounded-lg border border-[#2BAC67]">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <span className="font-bold text-gray-700">Colaborador: </span>
                  <span className="text-[#1F8A50] font-semibold">{colaboradorSeleccionado.cedula} - {colaboradorSeleccionado.nombre}</span>
                </div>
               
            
              </div>
              <div className="mt-2">
  
                  <span className="font-bold text-gray-700">Puesto: </span>
                  <span className="text-[#1F8A50] font-semibold">{colaboradorSeleccionado.puesto}</span>
                </div>

            </div>
          )}

          {errorRoles && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorRoles}
            </Alert>
          )}

          {/* Tabla de roles */}
          {colaboradorSeleccionado && (
            <>
              <div className="mb-6">
                <TableRol
                  roles={roles.map(r => r.nombre_rol)}
                  rolesSeleccionados={rolesSeleccionados}
                  loadingRoles={loadingRoles}
                  errorRoles={errorRoles}
                  puestoSeleccionado={colaboradorSeleccionado.puesto}
                  onSeleccionRol={handleRolSeleccion}
                />
              </div>

              {/* Botón de guardar */}
              <div className="flex justify-center">
                <SubmitButton
                  width="w-full md:w-auto"
                  disabled={loadingRoles}
                  onClick={manejarAsignarRoles}
                >
                  {loadingRoles ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
                </SubmitButton>
              </div>
            </>
          )}
        </div>
      </div>
      <CustomToaster />
    </div>
  );
}