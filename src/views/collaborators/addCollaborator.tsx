import { useState } from 'react';
import FormContainer from '../../components/formComponents/FormContainer'
import InputField from '../../components/formComponents/InputField'
import SelectField from '../../components/formComponents/SelectField'
import SubmitButton from '../../components/formComponents/SubmitButton';
import { useDepartments } from '../../hooks/manage/useDepartments';
import { useWorkstations } from '../../hooks/manage/useWorkstations';
import { useAreas } from '../../hooks/manage/useAreas';


function addCollaborator() {

    const [formData, setFormData] = useState({
        nombreCompleto: "",
        cedula: "",
        correo: "",
        numero: "",
        fechaNacimiento: "",
        area: "",
        departamento: "",
        puesto: "",
        rol: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Hooks para obtener las opciones de área, departamento y puesto
    const { areas } = useAreas();
    const { departments } = useDepartments();
    const { workstations } = useWorkstations();

    return (
        <div>
            <FormContainer title="Registro de Colaboradores" onSubmit={() => { }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <InputField
                        label="Nombre"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        placeholder="Ingrese el nombre"
                        required pattern={undefined} />

                    <InputField
                        label="Apellidos"
                        name="apellidos"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        placeholder="Ingrese los apellidos"
                        required pattern={undefined} />

                    <InputField
                        label="Cédula"
                        name="cedula"
                        value={formData.cedula}
                        onChange={handleChange}
                        placeholder="Ingrese la cedula"
                        required pattern={undefined} />

                    <InputField
                        label="Correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        placeholder="Ingrese el correo"
                        required pattern={undefined} />

                    <InputField
                        label="Número telefónico"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        placeholder="Ingrese el número telefónico"
                        required pattern={undefined} />

                    <InputField
                        label="Fecha de nacimiento"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        type="date"
                        required pattern={undefined} />

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
                        options={departments}
                        required
                        optionLabel="titulo_departamento" 
                        optionValue=" id_departamento" 
                    />

                    <SelectField
                        label="Puesto"
                        name="puesto"
                        value={formData.puesto}
                        onChange={handleChange}
                        options={workstations}
                        required
                        optionLabel="titulo_puesto" 
                        optionValue="id_puesto" 
                    />     
                </div>
                <div className="text-center mt-8">
                    <SubmitButton width="">{"Guardar"}</SubmitButton>
                </div>
            </FormContainer>
        </div>
    )
}

export default addCollaborator
