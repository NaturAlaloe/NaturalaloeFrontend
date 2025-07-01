import { useEffect, useState } from "react";
import FormContainer from "../../components/formComponents/FormContainer";
import InputField from "../../components/formComponents/InputField";
import SelectField from "../../components/formComponents/SelectField";
import SubmitButton from "../../components/formComponents/SubmitButton";
import { useDepartments } from "../../hooks/manage/useDepartments";
import { useWorkstations } from "../../hooks/manage/useWorkstations";
import { useAreas } from "../../hooks/manage/useAreas";
import { useAddCollaborator } from "../../hooks/collaborators/useAddCollaborator";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

function addCollaborator() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    apellido1: "",
    apellido2: "",
    cedula: "",
    correo: "",
    numero: "",
    fechaNacimiento: "",
    area: "",
    departamento: "",
    puesto: "",
    rol: "",
  });

  // Hooks para obtener todas las opciones
  const { areas } = useAreas();
  const { departments } = useDepartments();
  const { workstations } = useWorkstations();
  const { handleAddCollaborator, loading, error, success } =
    useAddCollaborator();

  // Filtrar departamentos según área seleccionada
  const filteredDepartments = formData.area
    ? departments.filter(
      (d: any) => String(d.id_area) === String(formData.area)
    )
    : [];
  // Filtrar puestos según departamento seleccionado
  const filteredWorkstations = formData.departamento
    ? workstations.filter(
      (w: any) => String(w.id_departamento) === String(formData.departamento)
    )
    : [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Limpiar selects dependientes
    if (name === "area") {
      setFormData({
        ...formData,
        area: value,
        departamento: "",
        puesto: "",
      });
    } else if (name === "departamento") {
      setFormData({
        ...formData,
        departamento: value,
        puesto: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const collaboratorData = {
      id_colaborador: Number(formData.cedula),
      id_puesto: Number(formData.puesto),
      nombre: formData.nombreCompleto,
      apellido1: formData.apellido1,
      apellido2: formData.apellido2,
      fecha_nacimiento: formData.fechaNacimiento,
      numero: formData.numero,
      correo: formData.correo,
    };
    console.log("Datos enviados al backend:", collaboratorData);
    await handleAddCollaborator(collaboratorData);
  };

  useEffect(() => {
    if (success) {
      setFormData({
        nombreCompleto: "",
        apellido1: "",
        apellido2: "",
        cedula: "",
        correo: "",
        numero: "",
        fechaNacimiento: "",
        area: "",
        departamento: "",
        puesto: "",
        rol: "",
      });
      showCustomToast("¡Éxito!", "¡Usuario registrado con éxito!", "success"); 
    }
    if (error) {
      showCustomToast("Error al registrar usuario", error, "error");
    }
  }, [success, error]);


  return (
    <div>
      <FormContainer title="Registro de Colaboradores" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Nombre"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
            required
            pattern={undefined}
          />


          <InputField
            label="Primer Apellido"
            name="apellido1"
            value={formData.apellido1}
            onChange={handleChange}
            placeholder="Ingrese el primer apellido"
            required
            pattern={undefined}
          />
          <InputField
            label="Segundo Apellido"
            name="apellido2"
            value={formData.apellido2}
            onChange={handleChange}
            placeholder="Ingrese el segundo apellido"
            required
            pattern={undefined}
          />
          <InputField
            label="Cédula"
            name="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Ingrese la cedula"
            required
            pattern={undefined}
          />

          <InputField
            label="Correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            placeholder="Ingrese el correo"
            required
            pattern={undefined}
          />

          <InputField
            label="Número telefónico"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            placeholder="Ingrese el número telefónico"
            required
            pattern={undefined}
          />

          <InputField
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            type="date"
            required
            pattern={undefined}
          />

          <SelectField
            label="Área"
            name="area"
            value={formData.area}
            onChange={handleChange}
            options={areas}
            required
            optionLabel="titulo"
            optionValue="id_area"
          />

          <SelectField
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
            options={filteredDepartments}
            required
            optionLabel="titulo_departamento"
            optionValue="id_departamento"
          />

          <SelectField
            label="Puesto"
            name="puesto"
            value={formData.puesto}
            onChange={handleChange}
            options={filteredWorkstations}
            required
            optionLabel="titulo_puesto"
            optionValue="id_puesto"
          />
        </div>
        <div className="text-center mt-8">
          <SubmitButton width="" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </SubmitButton>
        </div>
      </FormContainer>
    </div>
  );
}

export default addCollaborator;
