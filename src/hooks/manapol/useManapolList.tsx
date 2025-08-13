import { useEffect, useState, useMemo } from "react";
import {
  getManapolList,
  getObsoleteManapolList,
  updateManapol,
} from "../../services/manapol/manapolService";
import { getResponsibles } from "../../services/responsibles/getResponsibles";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";
import { useEditManapol } from "./useEditManapol";
import { useCreateNewManapolVersion } from "./useCreateNewManapolVersion";
import { useObsoleteManapol } from "./useObsoleteManapol";

interface ManapolVersion {
    titulo: string;
    vigente: number;
    revision: number;
    responsable: string;
    id_documento: number;
    fecha_vigencia: string;
    ruta_documento: string;
}

interface RegistroManapol {
    codigo_rm: string;
    titulo: string;
    fecha_creacion: string;
    id_area: number;
    area: string;
    departamento: string;
    versiones: ManapolVersion[];
}

type ManapolFilter = 'active' | 'obsolete';

export default function useManapolList() {
    const [registros, setRegistros] = useState<RegistroManapol[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [registrosFilter, setRegistrosFilter] = useState<ManapolFilter>('active');
    const [selectedVersions, setSelectedVersions] = useState<Record<string, number>>({});

    // Estados para responsables
    const [responsables, setResponsables] = useState<{ id_responsable: number; nombre_responsable: string }[]>([]);
    const [loadingResponsables, setLoadingResponsables] = useState(false);

    // Función para cargar responsables
    const loadResponsables = async () => {
        setLoadingResponsables(true);
        try {
            const data = await getResponsibles();
            setResponsables(data || []);
        } catch (error) {
            console.error('Error loading responsables:', error);
            showCustomToast("Error", "No se pudieron cargar los responsables", "error");
            setResponsables([]);
        } finally {
            setLoadingResponsables(false);
        }
    };

    // Función para cargar registros según el filtro
    const loadRegistros = async () => {
        setLoading(true);
        try {
            let data;
            if (registrosFilter === 'active') {
                data = await getManapolList();
            } else {
                data = await getObsoleteManapolList();
            }
            
            // Asegurar que data es un array
            const registrosArray = Array.isArray(data) ? data : [];
            setRegistros(registrosArray);
            
            // Configurar versiones seleccionadas por defecto
            const initialSelections: Record<string, number> = {};
            registrosArray.forEach((registro: RegistroManapol) => {
                if (registrosFilter === 'active') {
                    // Para registros activos, buscar la versión vigente o la primera
                    const vigenteVersion = registro.versiones?.find(v => v.vigente === 1);
                    const defaultVersion = vigenteVersion || registro.versiones?.[0];
                    if (defaultVersion) {
                        initialSelections[registro.codigo_rm] = defaultVersion.id_documento;
                    }
                } else {
                    // Para registros obsoletos, seleccionar la más reciente (último elemento del array)
                    // que representa la versión que estaba vigente cuando se marcó como obsoleta
                    if (registro.versiones && registro.versiones.length > 0) {
                        const ultimaVersion = registro.versiones[registro.versiones.length - 1];
                        initialSelections[registro.codigo_rm] = ultimaVersion.id_documento;
                    }
                }
            });
            setSelectedVersions(initialSelections);
        } catch (error) {
            console.error('Error loading Manapol records:', error);
            const errorMessage = registrosFilter === 'active' 
                ? "No se pudieron cargar los registros Manapol"
                : "No se pudieron cargar los registros Manapol obsoletos";
            showCustomToast("Error", errorMessage, "error");
            setRegistros([]); // Asegurar que siempre sea un array
        } finally {
            setLoading(false);
        }
    };

    // Función wrapper para actualizar registros
    const updateManapolWrapper = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
        try {
            await updateManapol(formData);
            return { success: true };
        } catch (error: any) {
            console.error('Error updating Manapol:', error);
            return { 
                success: false, 
                error: error.response?.data?.message || "Error al actualizar el registro" 
            };
        }
    };

    // Hook de edición
    const editHook = useEditManapol({
        responsibles: responsables.map(r => ({
            id_responsable: r.id_responsable.toString(),
            nombre_responsable: r.nombre_responsable
        })),
        updateManapol: updateManapolWrapper,
        fetchRegistros: loadRegistros,
    });

    // Hook para crear nueva versión
    const newVersionHook = useCreateNewManapolVersion({
        onSuccess: loadRegistros,
    });

    // Hook de obsolescencia
    const obsoleteHook = useObsoleteManapol({
        onSuccess: loadRegistros,
    });

    // Función para abrir el modal de edición
    const handleOpenEdit = (registro: RegistroManapol) => {
        const selectedVersionId = selectedVersions[registro.codigo_rm];
        const selectedVersion = registro.versiones?.find(v => v.id_documento === selectedVersionId);
        
        if (!selectedVersion) {
            showCustomToast("Error", "No se pudo encontrar la versión seleccionada", "error");
            return;
        }

        editHook.startEdit(registro, selectedVersion);
    };

    useEffect(() => {
        loadRegistros();
    }, [registrosFilter]);

    useEffect(() => {
        loadResponsables();
    }, []);

    const handleVersionChange = (codigoRm: string, versionId: string) => {
        setSelectedVersions(prev => ({
            ...prev,
            [codigoRm]: parseInt(versionId)
        }));
    };

    const handleFilterChange = (filter: ManapolFilter) => {
        setRegistrosFilter(filter);
        setCurrentPage(1);
        setSearch("");
    };

    // Expandir registros para mostrar la versión seleccionada
    const expandedRegistros = useMemo(() => {
        return registros.flatMap(registro => {
            const selectedVersionId = selectedVersions[registro.codigo_rm];
            if (!selectedVersionId) return [];

            const selectedVersion = registro.versiones.find(v => v.id_documento === selectedVersionId);
            if (!selectedVersion) return [];

            return [{
                ...registro,
                titulo: selectedVersion.titulo,
                responsable: selectedVersion.responsable,
                fecha_vigencia: selectedVersion.fecha_vigencia,
                ruta_documento: selectedVersion.ruta_documento,
                vigente: selectedVersion.vigente,
                revision: selectedVersion.revision,
                id_documento: selectedVersion.id_documento,
            }];
        });
    }, [registros, selectedVersions]);

    // Filtrar registros por búsqueda
    const filteredRegistros = useMemo(() => {
        if (!search) return expandedRegistros;
        const lowerSearch = search.toLowerCase();
        return expandedRegistros.filter((registro) =>
            registro.titulo.toLowerCase().includes(lowerSearch) ||
            registro.codigo_rm.toLowerCase().includes(lowerSearch) ||
            registro.departamento.toLowerCase().includes(lowerSearch) ||
            registro.responsable.toLowerCase().includes(lowerSearch)
        );
    }, [expandedRegistros, search]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleViewPdf = (ruta: string, titulo: string) => {
        if (!ruta) {
            showCustomToast(
                "Documento no disponible",
                `No se encontró el archivo PDF para ${titulo}`,
                "error"
            );
            return;
        }
        window.open(ruta, "_blank");
    };

    return {
        registros: filteredRegistros,
        loading,
        search,
        setSearch: handleSearch,
        currentPage,
        setCurrentPage,
        selectedVersions,
        handleVersionChange,
        registrosFilter,
        handleFilterChange,
        handleViewPdf,
        // Funcionalidades de edición
        responsables,
        loadingResponsables,
        handleOpenEdit,
        editHook,
        // Funcionalidades de crear nueva versión
        newVersionHook,
        // Funcionalidades de obsolescencia
        obsoleteHook,
    };
}