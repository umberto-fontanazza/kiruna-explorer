import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import API from "../API/API";
import {
  Coordinates,
  Document,
  DocumentForm,
  LinkType,
  UploadType,
} from "../utils/interfaces";

interface DocumentFormContextType {
  coordinates: Coordinates;
  searchableDocuments: Document[];
  documentFormSelected: Document | null;
  isSubmit: boolean;
  setCoordinates: Dispatch<SetStateAction<Coordinates>>;
  setSearchableDocuments: Dispatch<SetStateAction<Document[]>>;
  setDocumentFormSelected: Dispatch<SetStateAction<Document | null>>;
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
  handleAddNewDocument: (newDocument: DocumentForm, file: string) => void;
}

export const DocumentFormContext = createContext<
  DocumentFormContextType | undefined
>(undefined);

export const DocumentFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: -1,
    longitude: -1,
  });
  const [searchableDocuments, setSearchableDocuments] = useState<Document[]>(
    [],
  );
  const [documentFormSelected, setDocumentFormSelected] =
    useState<Document | null>(null);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleAddNewDocument = async (
    newDocument: DocumentForm,
    file: string,
  ) => {
    if (newDocument.id) {
      const fetchUpdate = async () => {
        try {
          await API.updateDocument(newDocument as Document);
          newDocument.links?.map(async (link: any) => {
            await API.putLink(
              newDocument.id!,
              link.targetDocumentId,
              link.linkTypes,
            );
          });
        } catch (err) {
          console.error(err);
        }
      };
      await fetchUpdate();
    } else {
      const id = await API.addDocument(newDocument as Document);
      newDocument.links?.forEach(
        async (link: { targetDocumentId: number; linkTypes: LinkType[] }) => {
          await API.putLink(link.targetDocumentId, id, link.linkTypes);
          searchableDocuments.map(async (doc) => {
            if (doc.id === link.targetDocumentId) {
              doc.links = await API.getLinks(doc.id);
            }
          });
        },
      );
      await API.addUpload(
        "Original resource upload test",
        UploadType.OriginalResource,
        file,
        [id],
      );
    }
    setIsSubmit(true);
    setDocumentFormSelected(null);
  };

  return (
    <DocumentFormContext.Provider
      value={{
        coordinates,
        setCoordinates,
        searchableDocuments,
        setSearchableDocuments,
        documentFormSelected,
        setDocumentFormSelected,
        isSubmit,
        setIsSubmit,
        //Functions
        handleAddNewDocument,
      }}
    >
      {children}
    </DocumentFormContext.Provider>
  );
};
