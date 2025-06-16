
export default function FullScreenSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DEF7E9] bg-opacity-80">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-16 w-16 text-[#2AAC67] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="#2AAC67"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="#13bd62"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-[#2AAC67] text-lg font-semibold">Cargando...</span>
      </div>
    </div>
  );
}