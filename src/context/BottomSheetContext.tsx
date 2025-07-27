import { createContext, useContext } from "react";

interface BottomSheetContextType {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);


export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error('useBottomSheet debe ser usado dentro de un BottomSheetProvider');
  }
  return context;
};

// Componente proveedor para envolver BottomSheet
export const BottomSheetProvider: React.FC<{ children: React.ReactNode, setIsVisible: React.Dispatch<React.SetStateAction<boolean>> }> = ({ children, setIsVisible }) => {
  return (
    <BottomSheetContext.Provider value={{ setIsVisible }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

export default BottomSheetContext;