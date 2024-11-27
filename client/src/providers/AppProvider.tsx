import React, { createContext, ReactNode, useState } from "react";
import API from "../API/API";
import { Coordinates, Document } from "../utils/interfaces";
import { PositionMode } from "../utils/modes";

// Definizione del tipo per il contesto
interface AppContextType {
  modalOpen: boolean;
  editDocumentMode: boolean;
  isPopupOpen: boolean;
  positionMode: PositionMode;
  visualLinks: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditDocumentMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPositionMode: React.Dispatch<React.SetStateAction<PositionMode>>;
  setVisualLinks: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditButton: () => void;
  handleCancelPopup: () => void;
  handleEditPositionModeConfirm: (
    docSelected: Document,
    newPos: Coordinates,
  ) => void;
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

  // Questo controlla solo il cambio di una scritta
  const [positionMode, setPositionMode] = useState<PositionMode>(
    PositionMode.None,
  );
  const [visualLinks, setVisualLinks] = useState<boolean>(false);

  const handleEditButton = () => {
    setEditDocumentMode(true);
    setModalOpen(true);
  };

  const handleCancelPopup = () => {
    setIsPopupOpen(false);
  };

  const handleEditPositionModeConfirm = async (
    docSelected: Document,
    newPos: Coordinates,
  ) => {
    if (docSelected) {
      try {
        const updateDocument = {
          ...docSelected,
          coordinates: {
            latitude: newPos.latitude,
            longitude: newPos.longitude,
          },
        };
        await API.updateDocument(updateDocument);
      } catch (err) {
        console.error(err);
      }
    }
    setPositionMode(PositionMode.None);
  };

  return (
    <AppContext.Provider
      value={{
        modalOpen,
        editDocumentMode,
        isPopupOpen,
        positionMode,
        visualLinks,
        setModalOpen,
        setEditDocumentMode,
        setIsPopupOpen,
        setPositionMode,
        setVisualLinks,
        //Functions
        handleEditButton,
        handleCancelPopup,
        handleEditPositionModeConfirm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
