import { Avatar, Button } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";

interface ProfileAvatarProps {
  avatar: string;
  name: string;
  isEditing: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({ 
  avatar, 
  name,
  isEditing, 
  onAvatarChange 
}: ProfileAvatarProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full md:w-auto">
      <div className="relative group">
        <Avatar 
          sx={{ 
            width: 120, 
            height: 120,
            fontSize: "3rem",
            bgcolor: avatar ? 'transparent' : '#d1fae5', // Verde claro
            color: '#065f46', // Verde oscuro para el texto
            border: '4px solid #a7f3d0' // Borde verde
          }} 
          src={avatar}
          alt="Foto de perfil"
          className="shadow-lg"
        >
          {!avatar && name.charAt(0)}
        </Avatar>
        
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-900 bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              component="label"
              variant="contained"
              color="success"
              size="small"
              startIcon={<CameraAlt />}
              sx={{
                color: 'white',
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669'
                }
              }}
            >
              Cambiar
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                onChange={onAvatarChange}
              />
            </Button>
          </div>
        )}
      </div>

      {isEditing && (
        <p className="text-xs text-emerald-600 text-center"> {/* Verde medio */}
          Formatos: JPG, PNG (Max. 2MB)
        </p>
      )}
    </div>
  );
}