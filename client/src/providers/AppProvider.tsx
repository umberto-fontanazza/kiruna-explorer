import React, { createContext, ReactNode, useState } from "react";

const appModes: "default" | "view-links" | "edit-document" = "default";
// Definizione del tipo per il contesto
interface AppContextType {
  modalOpen: boolean;
  editDocumentMode: boolean;
  isPopupOpen: boolean;
  editPositionMode: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDocumentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPositionMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditButton: () => void;
  handleCancelPopup: () => void;
}

// Creazione del contesto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contesto
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editDocumentMode, setEditDocumentMode] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editPositionMode, setEditPositionMode] = useState<boolean>(false);

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        modalOpen,
        editDocumentMode,
        isPopupOpen,
        editPositionMode,
        setModalOpen,
        setEditDocumentMode,
        setIsPopupOpen,
        setEditPositionMode,
        //Functions
        handleEditButton,
        handleCancelPopup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
