import  { createContext, useContext, type ReactNode } from 'react';
import { useRolesProcedures } from '../../hooks/procedures/useRolesProcedures';


// Este hook maneja los roles y sus procedimientos/políticas

interface RolesProceduresContextType {
  rolesProcedures: any[];
  loading: boolean;
  saveProcedures: (id_rol: number, procedimientos: number[]) => Promise<void>;
  removeProcedures: (id_rol: number, procedimientos: number[]) => Promise<void>;
  savePolitics: (id_rol: number, politicas: number[]) => Promise<void>;
  removePolitics: (id_rol: number, politicas: number[]) => Promise<void>;
  refreshData: () => Promise<void>;
}

const RolesProceduresContext = createContext<RolesProceduresContextType | undefined>(undefined);

interface RolesProceduresProviderProps {
  children: ReactNode;
}

export function RolesProceduresProvider({ children }: RolesProceduresProviderProps) {
  const rolesData = useRolesProcedures();

  return (
    <RolesProceduresContext.Provider value={rolesData}>
      {children}
    </RolesProceduresContext.Provider>
  );
}

export function useRolesProceduresContext() {
  const context = useContext(RolesProceduresContext);
  if (context === undefined) {
    throw new Error('useRolesProceduresContext must be used within a RolesProceduresProvider');
  }
  return context;
}