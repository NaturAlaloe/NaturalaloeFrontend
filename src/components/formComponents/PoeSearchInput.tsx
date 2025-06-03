import React from "react";

export default function PoeSearchInput({
  label = "Buscar POE existente",
  busqueda,
  setBusqueda,
  showSugerencias,
  setShowSugerencias,
  resultados,
  onSelect,
}) {
  return (
    <div className="relative mb-6">
      <label className="block text-sm font-semibold text-[#2AAC67] mb-2">
        {label}
      </label>
      <input
        type="text"
        placeholder="Buscar por código o título"
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setShowSugerencias(true);
        }}
        onBlur={() => setTimeout(() => setShowSugerencias(false), 100)}
        className="w-full p-3 border border-[#2AAC67] rounded-lg text-[#2AAC67]"
      />
      {showSugerencias && busqueda.length > 0 && (
        <ul className="absolute z-10 bg-white border border-[#2AAC67] rounded-lg w-full max-h-40 overflow-y-auto shadow">
          {resultados.length > 0 ? (
            resultados.map((poe) => (
              <li
                key={poe.codigo}
                className="px-4 py-2 hover:bg-[#e6f9f0] cursor-pointer"
                onMouseDown={() => {
                  onSelect(poe);
                  setShowSugerencias(false);
                }}
              >
                {poe.codigo} - {poe.titulo}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-400">Sin resultados</li>
          )}
        </ul>
      )}
    </div>
  );
}