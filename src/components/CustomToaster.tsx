import { Toaster, toast, ToastBar } from 'react-hot-toast';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

type ToastType = 'success' | 'error' | 'info';

const toastStyles: Record<
  ToastType,
  { border: string; icon: JSX.Element; borderTw: string }
> = {
  success: {
    border: '#13bd62',
    borderTw: 'border-[#13bd62]',
    icon: <CheckCircleIcon style={{ color: '#13bd62', fontSize: 24, marginRight: 10 }} />,
  },
  error: {
    border: '#e53935',
    borderTw: 'border-[#e53935]',
    icon: <ErrorIcon style={{ color: '#e53935', fontSize: 24, marginRight: 10 }} />,
  },
  info: {
    border: '#1976d2',
    borderTw: 'border-[#1976d2]',
    icon: <InfoIcon style={{ color: '#1976d2', fontSize: 24, marginRight: 10 }} />,
  },
};

export function showCustomToast(
  title: string,
  subtitle?: string,
  type: ToastType = 'success'
) {
  const { border, icon, borderTw } = toastStyles[type];
  toast.custom(
    (t) => (
      <div
        className={`
          min-w-[220px] max-w-[320px] bg-white text-[#304328] rounded-xl shadow-lg
          px-4 py-3 pr-2 font-sans flex flex-row items-center gap-2.5 relative
          border ${borderTw} border-l-4
          transition-all duration-300
          ${t.visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-3'}
          overflow-hidden
        `}
        style={{
          borderLeft: `5px solid ${border}`,
        }}
      >
        <div
          className="flex items-center ml-2"
          style={{
            animation: t.visible
              ? 'toastIconIn 0.5s cubic-bezier(.4,2,.3,1)'
              : 'none',
          }}
        >
          <span
            className={t.visible ? "animate-bounce-in" : ""}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold text-base mb-0.5 truncate tracking-wide"
            style={{
              animation: t.visible
                ? 'toastTextIn 0.6s cubic-bezier(.4,2,.3,1)'
                : 'none',
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              className="font-normal text-xs opacity-90 break-words"
              style={{
                animation: t.visible
                  ? 'toastTextIn 0.7s cubic-bezier(.4,2,.3,1)'
                  : 'none',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-[#f4fcec] border-none cursor-pointer p-1 ml-2 mt-0 text-[#304328] rounded transition-colors duration-200 flex items-center justify-center"
          aria-label="Cerrar"
        >
          <CloseIcon fontSize="small" />
        </button>
        <style>
          {`
            @keyframes toastIconIn {
              0% { opacity: 0; transform: scale(0.7) rotate(-10deg);}
              100% { opacity: 1; transform: scale(1) rotate(0);}
            }
            @keyframes toastTextIn {
              0% { opacity: 0; transform: translateY(10px);}
              100% { opacity: 1; transform: translateY(0);}
            }
            @keyframes bounce-in {
              0% { transform: scale(0.7) rotate(-10deg);}
              60% { transform: scale(1.15) rotate(3deg);}
              80% { transform: scale(0.95) rotate(-2deg);}
              100% { transform: scale(1) rotate(0);}
            }
            .animate-bounce-in {
              animation: bounce-in 0.7s cubic-bezier(.4,2,.3,1);
            }
          `}
        </style>
      </div>
    ),
    { duration: 3500 }
  );
}

export default function CustomToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
    >
      {(t) => <ToastBar toast={t} />}
    </Toaster>
  );
}