import React, { createContext, ReactNode, useState } from "react";
import API from "./API/API";
import { Document } from "./utils/interfaces";

// Definizione del tipo per il contesto
interface AppContextType {
  docSelected: Document | null;
  modalOpen: boolean;
  editDocumentMode: boolean;
  isPopupOpen: boolean;
  editPositionMode: boolean;
  setDocSelected: React.Dispatch<React.SetStateAction<Document | null>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDocumentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditPositionMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditButton: () => void;
  handleDeleteDocument: () => Promise<void>;
  handleCancelPopup: () => void;
}

// Creazione del contesto
export const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider del contesto
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [docSelected, setDocSelected] = useState<Document | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editDocumentMode, setEditDocumentMode] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [editPositionMode, setEditPositionMode] = useState<boolean>(false);

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
  };

  const handleDeleteDocument = async () => {
    if (!docSelected) return;

    try {
      if (docSelected.links && docSelected.links.length > 0) {
        for (const link of docSelected.links) {
          await API.deleteLink(docSelected.id, link.targetDocumentId);
        }
      }
      await API.deleteDocument(docSelected.id);
      //setDocuments((prev) => prev.filter((doc) => doc.id !== docSelected.id));
      setDocSelected(null);
      setIsPopupOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        docSelected,
        modalOpen,
        editDocumentMode,
        isPopupOpen,
        editPositionMode,
        setDocSelected,
        setModalOpen,
        setEditDocumentMode,
        setIsPopupOpen,
        setEditPositionMode,
        //Functions
        handleEditButton,
        handleDeleteDocument,
        handleCancelPopup,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
