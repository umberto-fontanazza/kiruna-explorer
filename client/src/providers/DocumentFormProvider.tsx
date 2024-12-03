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
  documentFormDefaults,
  Link,
  LinkType,
  UploadForm,
  UploadType,
} from "../utils/interfaces";

interface DocumentFormContextType {
  coordinates: Coordinates;
  searchableDocuments: Document[];
  documentFormSelected: DocumentForm;
  isSubmit: boolean;
  setCoordinates: Dispatch<SetStateAction<Coordinates>>;
  setSearchableDocuments: Dispatch<SetStateAction<Document[]>>;
  setDocumentFormSelected: Dispatch<SetStateAction<DocumentForm>>;
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
  handleAddNewDocument: (newDocument: DocumentForm, file: string) => void;
  handleUpdateDocument: (
    document: DocumentForm,
    oldDocumentLinks: Link[] | undefined,
  ) => void;
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
    useState<DocumentForm>(documentFormDefaults);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleAddNewDocument = async (
    newDocument: DocumentForm,
    uploads?: UploadForm[],
  ) => {
    if (!newDocument.id) {
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
      if (uploads) {
        uploads.forEach(
          async (upload) =>
            await API.addUpload(
              upload.title,
              UploadType.OriginalResource,
              upload.data,
              [id],
            ),
        );
      }
    }

    setIsSubmit(true);
    setDocumentFormSelected(documentFormDefaults);
  };

  const handleUpdateDocument = async (
    document: DocumentForm,
    oldDocumentLinks: Link[] | undefined,
  ) => {
    if (document.id) {
      try {
        await API.updateDocument(document as Document);

        if (document.links) {
          for (const link of document.links) {
            await API.putLink(
              document.id!,
              link.targetDocumentId,
              link.linkTypes,
            );
          }
        }

        if (oldDocumentLinks) {
          const newTargetIds =
            document.links?.map((link) => link.targetDocumentId) || [];

          const linksToDelete = oldDocumentLinks.filter(
            (oldLink) => !newTargetIds.includes(oldLink.targetDocumentId),
          );

          for (const link of linksToDelete) {
            await API.deleteLink(document.id!, link.targetDocumentId);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    setIsSubmit(true);
    setDocumentFormSelected(documentFormDefaults);
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
        handleUpdateDocument,
      }}
    >
      {children}
    </DocumentFormContext.Provider>
  );
};
