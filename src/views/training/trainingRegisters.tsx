import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/formComponents/FormContainer";

const cards = [
  {
    title: "Agregar Capacitaciones",
    description: "Registra nuevas capacitaciones específicas.",
    to: "/training",
  },
  {
    title: "Agregar Capacitaciones Generales",
    description: "Registra capacitaciones generales para la organización.",
    to: "/training/generalTraining",
  },
  {
    title: "Agregar Facilitadores",
    description: "Registra nuevos facilitadores para las capacitaciones.",
    to: "/training/facilitatorTraining",
  },
];

export default function TrainingRegisters() {
  const navigate = useNavigate();

  return (
    <FormContainer title="Registros de Capacitaciones" onSubmit={e => e.preventDefault()}>
      <div className="w-full max-w-3xl mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white border-2 border-[#2AAC67] rounded-xl shadow-md px-6 py-4 flex flex-col items-center w-full max-w-xs min-h-[120px] text-center cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2 hover:border-[#1e8a53] hover:bg-[#f6fcf9]"
              onClick={() => navigate(card.to)}
              tabIndex={0}
              role="button"
              onKeyDown={e => (e.key === "Enter" || e.key === " ") && navigate(card.to)}
            >
              <div className="text-xl font-semibold text-[#2AAC67] mb-1">{card.title}</div>
              <div className="text-gray-700 text-sm">{card.description}</div>
            </div>
          ))}
        </div>
      </div>
    </FormContainer>
  );
}
