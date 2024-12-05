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
  Document,
  DocumentForm,
  documentFormDefaults,
  Link,
  LinkType,
  Upload,
  UploadType,
} from "../utils/interfaces";

interface DocumentFormContextType {
  searchableDocuments: Document[];
  documentFormSelected: DocumentForm;
  isSubmit: boolean;
  setSearchableDocuments: Dispatch<SetStateAction<Document[]>>;
  setDocumentFormSelected: Dispatch<SetStateAction<DocumentForm>>;
  setIsSubmit: Dispatch<SetStateAction<boolean>>;
  handleAddNewDocument: (newDocument: DocumentForm, file: Upload[]) => void;
  handleUpdateDocument: (
    document: DocumentForm,
    oldDocumentLinks: Link[] | undefined,
    filesToUpload: Upload[] | undefined,
  ) => void;
}

export const DocumentFormContext = createContext<
  DocumentFormContextType | undefined
>(undefined);

export const DocumentFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [searchableDocuments, setSearchableDocuments] = useState<Document[]>(
    [],
  );
  const [documentFormSelected, setDocumentFormSelected] =
    useState<DocumentForm>(documentFormDefaults);

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleAddNewDocument = async (
    newDocument: DocumentForm,
    uploads?: Upload[],
  ) => {
    if (!newDocument.id) {
      const id = await API.addDocument(newDocument as Document);
      newDocument.links?.forEach(
        async (link: { targetDocumentId: number; linkTypes: LinkType[] }) => {
          await API.putLink(id, link.targetDocumentId, link.linkTypes);
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
              upload.file,
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
    filesToUpload: Upload[] | undefined,
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

        if (filesToUpload) {
          filesToUpload.map(
            async (file) =>
              await API.addUpload(file.title, file.type, file.file, [
                document.id!,
              ]),
          );
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
