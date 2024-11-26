import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { Document } from "../utils/interfaces";

interface PopupContextType {
  documentToDelete: Document | null;
  setDocumentToDelete: Dispatch<SetStateAction<Document | null>>;
  isDeleted: boolean;
  setIsDeleted: Dispatch<SetStateAction<boolean>>;
}

export const PopupContext = createContext<PopupContextType | undefined>(
  undefined,
);

export const PopupProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null,
  );
  const [isDeleted, setIsDeleted] = useState<boolean>(false);

  return (
    <PopupContext.Provider
      value={{ documentToDelete, setDocumentToDelete, isDeleted, setIsDeleted }}
    >
      {children}
    </PopupContext.Provider>
  );
};
