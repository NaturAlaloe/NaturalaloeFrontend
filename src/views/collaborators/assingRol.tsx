import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import useCollaborators from '../../hooks/collaborator/useCollaborators';
import useRoles from '../../hooks/collaborator/useRols';
import TableRol from '../../components/globalComponents/TableRol';
import InputField from '../../components/formComponents/InputField';
import SubmitButton from '../../components/formComponents/SubmitButton';
import CustomToaster, { showCustomToast } from '../../components/globalComponents/CustomToaster';

// Extraer el ID del colaborador seleccionado
const extractId = (colaborador: string) => colaborador.split(' - ')[0];

export default function AssignRol() {
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>([]);
  const [colaboradorSeleccionado, setColaboradorSeleccionado] = useState<string | null>(null);
  const [pagina, setPagina] = useState(0); // Estado para la página de paginación
  const rolesPorPagina = 7; // Número de roles por página

  const { collaborators, loading, error, searchTerm, setSearchTerm } = useCollaborators();
  const { roles, collaboratorRoles, loadingRoles, errorRoles, assignRoles, unassignRoles } = useRoles(
    colaboradorSeleccionado ? extractId(colaboradorSeleccionado) : undefined
  );

  // Manejar cambio en el campo de búsqueda
  const manejarCambioBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(evento.target.value);
    setColaboradorSeleccionado(null);
    setRolesSeleccionados([]);
  };

  // Función para cambiar de página
  const manejarCambioPagina = (event: unknown, newPage: number) => {
    setPagina(newPage);
  };

  // Manejar selección de colaborador
  const manejarSeleccionColaborador = (
    id: string,
    nombre?: string,
    apellido1?: string,
    apellido2?: string,
    puesto?: string
  ) => {
    const nombreCompleto = [nombre, apellido1, apellido2].filter(Boolean).join(' ').trim() || 'Sin nombre';
    setColaboradorSeleccionado(`${id} - ${nombreCompleto}`);
    setPagina(0);
  };

  // Manejar selección de roles
  const manejarSeleccionRol = (rol: string) => {
    const selectedCollaborator = collaborators.find(colab =>
      colaboradorSeleccionado?.startsWith(`${colab.id_colaborador} -`)
    );
    if (rol !== selectedCollaborator?.puesto) {
      setRolesSeleccionados(prev =>
        prev.includes(rol) ? prev.filter(r => r !== rol) : [...prev, rol]
      );
    }
  };


  // Manejar cambio de página
  const manejarCambioPagina = (_: unknown, nuevaPagina: number) => {
    setPagina(nuevaPagina);

  // Manejar asignación y desasignación de roles
  const manejarAsignarRoles = async () => {
    if (!colaboradorSeleccionado) {
      showCustomToast('Por favor, selecciona un colaborador.', undefined, 'error');
      return;
    }
    const rolesExistentes = collaboratorRoles.map(role => role.nombre_rol);
    const puesto = collaborators.find(colab => colab.id_colaborador === extractId(colaboradorSeleccionado))?.puesto || '';
    const rolesAAsignar = rolesSeleccionados.filter(rol => !rolesExistentes.includes(rol) && rol !== puesto);
    const rolesADesasignar = rolesExistentes.filter(rol => !rolesSeleccionados.includes(rol) && rol !== puesto);

    if (rolesAAsignar.length === 0 && rolesADesasignar.length === 0) {
      showCustomToast('No hay cambios para guardar.', undefined, 'info');
      return;
    }

    try {
      if (rolesAAsignar.length > 0) {
        await assignRoles(rolesAAsignar);
      }
      if (rolesADesasignar.length > 0) {
        await unassignRoles(rolesADesasignar);
      }
      showCustomToast('Cambios actualizados', undefined, 'success');
    } catch (error) {
      showCustomToast('Fallo al actualizar', undefined, 'error');
      console.error('Error al procesar roles:', error);
    }

  };

  // Roles a mostrar en la página actual
  const rolesPaginados =
    roles.length > 0
      ? roles.map(r => r.nombre_rol).slice(pagina * rolesPorPagina, pagina * rolesPorPagina + rolesPorPagina)
      : [];

  // Encontrar el colaborador seleccionado para obtener su puesto
  const selectedCollaborator = collaborators.find(
    colab => colaboradorSeleccionado && colaboradorSeleccionado.startsWith(`${colab.id_colaborador} -`)
  );
  const puestoSeleccionado = selectedCollaborator ? selectedCollaborator.puesto || 'Sin puesto' : 'Sin puesto';

  // Sincronizar rolesSeleccionados con los roles actuales del colaborador
  useEffect(() => {
    if (colaboradorSeleccionado) {
      const selected = collaborators.find(colab =>
        colaboradorSeleccionado.startsWith(`${colab.id_colaborador} -`)
      );
      const puesto = selected?.puesto;
      const nuevosSeleccionados = [
        ...(puesto ? [puesto] : []),
        ...collaboratorRoles.map(role => role.nombre_rol).filter(role => role !== puesto),
      ].filter(Boolean);
      setRolesSeleccionados(nuevosSeleccionados);
    } else {
      setRolesSeleccionados([]);
    }
  }, [colaboradorSeleccionado, collaboratorRoles]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E6F3EA 0%, #F6FBF7 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '90%',
          maxWidth: 800,
          p: 4,
          borderRadius: 6,
          border: '2px solid #2AAC67',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: '#2AAC67', fontWeight: 'bold', mb: 3, letterSpacing: '1px', textAlign: 'center' }}
        >
          Asignar Procedimientos a Roles
        </Typography>

        {/* Buscador de colaboradores con resultados en tiempo real */}
        <Box sx={{  maxWidth: '100%', mx: 'auto'  }}>
        <InputField
          name="busqueda"
          value={searchTerm}
          onChange={manejarCambioBusqueda}
          placeholder="Buscar por nombre o código"
          className="mb-2 "
         
        />
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {searchTerm && !colaboradorSeleccionado && (
          <Box sx={{ mb: 3, maxHeight: 150, overflowY: 'auto', bgcolor: '#F6FBF7', borderRadius: 4, p: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : !collaborators || collaborators.length === 0 ? (
              <Typography sx={{ color: '#888' }}>
                {searchTerm ? `No se encontraron colaboradores con "${searchTerm}"` : 'Cargando...'}
              </Typography>
            ) : (
              collaborators
                .filter(colab => colab && typeof colab.id_colaborador === 'string')
                .map(colab => (
                  <Typography
                    key={colab.id_colaborador}
                    sx={{ color: '#2AAC67', mb: 1, cursor: 'pointer', '&:hover': { color: '#1F8A50' } }}
                    onClick={() =>
                      manejarSeleccionColaborador(
                        colab.id_colaborador,
                        colab.nombre,
                        colab.apellido1,
                        colab.apellido2,
                        colab.puesto
                      )
                    }
                  >
                    {colab.id_colaborador} - {[colab.nombre, colab.apellido1, colab.apellido2]
                      .filter(Boolean)
                      .join(' ')
                      .trim() || 'Sin nombre'}
                  </Typography>
                ))
            )}
          </Box>
        )}
        {colaboradorSeleccionado && (
          <Box sx={{ mb: 3, mt: 2}}>
            <Typography sx={{ color: 'black', mb: 1, fontWeight: 'bold' }}>
              Colaborador seleccionado:{' '}
              <span style={{ color: '#1F8A50' }}>{colaboradorSeleccionado}</span>
            </Typography>
            <Typography sx={{color: 'black', mb: 1, fontWeight: 'bold' }}>
              Puesto de trabajo:{' '}
              <span style={{ color: '#1F8A50' }}>{puestoSeleccionado}</span>
            </Typography>
          </Box>
        )}

        {errorRoles && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorRoles}
          </Alert>
        )}

        {colaboradorSeleccionado && (
          <TableRol
            roles={rolesPaginados}
            rolesSeleccionados={rolesSeleccionados}
            loadingRoles={loadingRoles}
            errorRoles={errorRoles}
            puestoSeleccionado={puestoSeleccionado}
            onSeleccionRol={manejarSeleccionRol}
            pagina={pagina}
            rolesPorPagina={rolesPorPagina}
            totalRoles={roles.length}
            onPageChange={manejarCambioPagina}
          />
        )}

        {colaboradorSeleccionado && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <SubmitButton
              width="w-full"
              disabled={loadingRoles}
              onClick={manejarAsignarRoles}
            >
              {loadingRoles ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cambios'}
            </SubmitButton>
          </Box>
        )}
      </Paper>
      <CustomToaster />
    </Box>
  );
}
}