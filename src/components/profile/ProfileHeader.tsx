import { Button } from "@mui/material";
import { Edit, Save, Close } from "@mui/icons-material";

interface ProfileHeaderProps {
  title: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onCancel?: () => void;
}

export default function ProfileHeader({ 
  title, 
  isEditing, 
  onToggleEdit,
  onCancel
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-emerald-50"> {/* Verde claro */}
      <h1 className="text-2xl md:text-3xl font-bold text-emerald-800"> {/* Verde oscuro */}
        {title}
      </h1>
      
      <div className="flex gap-2">
        {isEditing && onCancel && (
          <Button
            startIcon={<Close />}
            onClick={onCancel}
            variant="outlined"
            color="error"
            className="!capitalize !font-medium"
            size="medium"
          >
            Cancelar
          </Button>
        )}
        
        <Button
          startIcon={isEditing ? <Save /> : <Edit />}
          onClick={onToggleEdit}
          variant={isEditing ? "contained" : "outlined"}
          color="success" 
          className="!capitalize !font-medium"
          size="medium"
          sx={{
            backgroundColor: isEditing ? '#10b981' : undefined, // Verde para el estado activo
            '&:hover': {
              backgroundColor: isEditing ? '#059669' : '#f0fdf4' // Verde más oscuro/claro
            }
          }}
        >
          {isEditing ? "Guardar" : "Editar"}
        </Button>
      </div>
    </div>
  );
}