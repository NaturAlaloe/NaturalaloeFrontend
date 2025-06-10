import useProfile from "../../hooks/profile/useProfile";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileAvatar from "../../components/profile/ProfileAvatar";
import ProfileField from "../../components/profile/ProfileField";


export default function Profile() {
  const {
    isEditing,
    userData,
    toggleEditing,
    handleInputChange,
    handleAvatarChange,
    setUserData
  } = useProfile();

  const handleCancel = () => {
    toggleEditing();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-emerald-100"> {/* Card styling */}
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileAvatar 
          avatar={userData.avatar} 
          name={userData.name}
          isEditing={isEditing} 
          onAvatarChange={handleAvatarChange} 
        />
        
        <div className="flex-1 space-y-6">
          <ProfileHeader 
            title={userData.name} 
            isEditing={isEditing} 
            onToggleEdit={toggleEditing}
            onCancel={handleCancel}
          />
          
          <div className="space-y-4">
            <ProfileField
              label="Correo electrónico"
              name="email"
              value={userData.email}
              type="email"
            />
            
            <ProfileField
              label="Cargo"
              name="position"
              value={userData.position}
              editing={isEditing}
              onChange={handleInputChange}
            />
            
            <ProfileField
              label="Departamento"
              name="department"
              value={userData.department}
              editing={isEditing}
              onChange={handleInputChange}
            />
            
            <ProfileField
              label="Biografía"
              name="bio"
              value={userData.bio}
              editing={isEditing}
              onChange={handleInputChange}
              multiline
            />
          </div>
        </div>
      </div>
    </div>
  );
}
