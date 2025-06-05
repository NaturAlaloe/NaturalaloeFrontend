

interface VigenciaToggleProps {
  enVigencia: boolean;
  setEnVigencia: (value: boolean) => void;
}

export default function VigenciaToggle({ enVigencia, setEnVigencia }: VigenciaToggleProps) {
  return (
    <div className="md:col-start-3 md:row-start-3 flex flex-row items-center justify-center mt-8 gap-2">
      <button
        type="button"
        onClick={() => setEnVigencia(true)}
        className={`px-4 py-1 rounded-full border ${
          enVigencia
            ? "bg-[#2AAC67] text-white border-[#2AAC67]"
            : "bg-white text-[#2AAC67] border-[#2AAC67]"
        }`}
      >
        En vigencia
      </button>
      <button
        type="button"
        onClick={() => setEnVigencia(false)}
        className={`px-4 py-1 rounded-full border ${
          !enVigencia
            ? "bg-red-400 text-white border-red-400"
            : "bg-white text-red-400 border-red-400"
        }`}
      >
        No vigente
      </button>
    </div>
  );
}
