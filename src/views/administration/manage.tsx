import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/formComponents/FormContainer";

const cards = [
  {
    title: "Áreas",
    description: "Gestiona las áreas de la organización.",
    to: "/administration/listAreas",
  },
  {
    title: "Puestos",
    description: "Gestiona los puestos de trabajo.",
    to: "/administration/puestos",
  },
  {
    title: "Categorías",
    description: "Gestiona las categorías de puestos.",
    to: "/administration/categorias",
  },
  {
    title: "Departamentos",
    description: "Gestiona los departamentos.",
    to: "/administration/departamentos",
  },
];

export default function Manage() {
  const navigate = useNavigate();

  return (
    <FormContainer title="Administración" onSubmit={e => e.preventDefault()}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white border border-[#2AAC67] rounded-2xl shadow-xl p-8 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate(card.to)}
          >
            <div className="text-5xl mb-4">{card.icon}</div>
            <div className="text-xl font-bold text-[#2AAC67] mb-2">{card.title}</div>
            <div className="text-gray-600 text-center">{card.description}</div>
          </div>
        ))}
      </div>
    </FormContainer>
  );
}