import FormContainer from '../../components/formComponents/FormContainer'
import InputField from '../../components/formComponents/InputField'
import SelectField from '../../components/formComponents/SelectField'


function addCollaborator() {
    return (
        <div>

            <FormContainer title="Registro de Colaboradores" onSubmit={() => { }}>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <InputField
                        label="Nombre Completo"
                        name="nombre"
                        value={''}
                        onChange={() => { }}
                        placeholder="Ingrese el nombre"
                        required pattern={undefined} />

                    <InputField
                        label="Cédula"
                        name="cedula"
                        value={''}
                        onChange={() => { }}
                        placeholder="Ingrese la cedula"
                        required pattern={undefined} />

                    <InputField
                        label="Correo"
                        name="correo"
                        value={''}
                        onChange={() => { }}
                        placeholder="Ingrese el correo"
                        required pattern={undefined} />

                    <InputField
                        label="Número telefónico"
                        name="numero"
                        value={''}
                        onChange={() => { }}
                        placeholder="Ingrese el número telefónico"
                        required pattern={undefined} />

                    <InputField
                        label="Fecha de nacimiento"
                        name="fecha"
                        value={''}
                        onChange={() => { }}
                        type="date"
                        required pattern={undefined} />

                    <SelectField
                        label="Área"
                        name="area"
                        value={''}
                        onChange={() => { }}
                        options={[]}
                        required
                        optionLabel="area"
                        optionValue="area"
                    />

                    <SelectField
                        label="Departamento"
                        name="departamento"
                        value={''}
                        onChange={() => { }}
                        options={[]}
                        required
                        optionLabel="departamento"
                        optionValue="departamento"
                    />

                    <SelectField
                        label="Puesto"
                        name="puesto"
                        value={''}
                        onChange={() => { }}
                        options={[]}
                        required
                        optionLabel="puesto"
                        optionValue="puesto"
                    />

                    <SelectField
                        label="Colaborador"
                        name="colaborador"
                        value={''}
                        onChange={() => { }}
                        options={[]}
                        required
                        optionLabel="colaborador"
                        optionValue="colaborador"
                    />
                </div>

            </FormContainer>

        </div>
    )
}

export default addCollaborator
