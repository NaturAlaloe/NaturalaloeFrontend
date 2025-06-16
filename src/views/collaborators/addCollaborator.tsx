import { useState } from 'react';
import FormContainer from '../../components/formComponents/FormContainer'
import InputField from '../../components/formComponents/InputField'
import SelectField from '../../components/formComponents/SelectField'
import SubmitButton from '../../components/formComponents/SubmitButton';

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
                        options={[]}
                        required
                        optionLabel="area"
                        optionValue="area"
                    />

                    <SelectField
                        label="Departamento"
                        name="departamento"
                        value={formData.departamento}
                        onChange={handleChange}
                        options={[]}
                        required
                        optionLabel="departamento"
                        optionValue="departamento"
                    />

                    <SelectField
                        label="Puesto"
                        name="puesto"
                        value={formData.puesto}
                        onChange={handleChange}
                        options={[]}
                        required
                        optionLabel="puesto"
                        optionValue="puesto"
                    />

                    {/* el rol se manda por defecto dependiendo del puesto */}
                    
                </div>


                <div className="text-center mt-8">
                    <SubmitButton width="">{"Guardar"}</SubmitButton>
                </div>
            </FormContainer>
        </div>
    )
}

export default addCollaborator
