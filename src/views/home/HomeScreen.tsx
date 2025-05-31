import { Home as HomeIcon } from '@mui/icons-material';

export default function HomeScreen() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#f4fcec] p-4">
      <div className="bg-[#ccc] rounded-2xl shadow-xl px-8 py-10 min-w-[340px] max-w-[420px] text-center flex flex-col items-center">
        <HomeIcon className="text-green-600 mb-4" style={{ fontSize: 60 }} />
        <h1 className="text-3xl font-bold text-green-800 mb-2">¡Bienvenido!</h1>
        <p className="text-base text-[#304328] mb-6">
          Este es el inicio de tu aplicación Natural Aloe. <br />
          Usa el menú lateral para navegar por las diferentes secciones.
        </p>
        <a
          href="https://naturalaloe.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-800 text-white font-bold tracking-wide px-8 py-3 rounded-lg transition-colors duration-200"
        >
          Ir al sitio web
        </a>
      </div>
    </div>
  );
}