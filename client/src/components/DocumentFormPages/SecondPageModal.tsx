import { Dispatch, FC, SetStateAction, useState } from "react";
import { Document, DocumentForm, Link, LinkType } from "../../utils/interfaces";
import { capitalizeFirstLetter } from "../../utils/utils";
import LinksTable from "../LinksTable";
import SearchBar from "../SearchBar";

interface SecondPageModalProps {
  documentForm: DocumentForm;
  tableLinks: Link[];
  setTableLinks: Dispatch<SetStateAction<Link[]>>;
  goBack: Dispatch<SetStateAction<number>>;
}

const SecondPageModal: FC<SecondPageModalProps> = ({
  tableLinks,
  setTableLinks,
  goBack,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [linkType, setLinkType] = useState(LinkType.Direct);

  const handleAddLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedDocument?.id && linkType) {
      const targetDocumentId = selectedDocument.id;
      const existingLink = tableLinks.find(
        (link) => link.targetDocumentId === targetDocumentId,
      );

      if (!existingLink?.linkTypes.includes(linkType)) {
        setTableLinks((oldTableLinks) =>
          oldTableLinks.map((tableLink) =>
            tableLink.targetDocumentId === targetDocumentId
              ? { ...tableLink, linkTypes: [...tableLink.linkTypes, linkType] }
              : tableLink,
          ),
        );
      }

      if (!existingLink) {
        setTableLinks((oldTableLinks) => [
          ...oldTableLinks,
          { targetDocumentId, linkTypes: [linkType] },
        ]);
      }
    }
  };

  return (
    <>
      <div className="form-content">
        {tableLinks.length > 0 ? (
          <LinksTable tableLinks={tableLinks} setTableLinks={setTableLinks} />
        ) : (
          <p>
            If you need to add connections to other documents, please use the
            search bar below.
          </p>
        )}

        <div className="search-link">
          <div className="search-link-row">
            <SearchBar setSelectedSuggestion={setSelectedDocument} />
            <select
              className="search-link-type"
              onChange={(e) => setLinkType(e.target.value as LinkType)}
            >
              {Object.values(LinkType).map((linkType) => (
                <option key={linkType} value={linkType}>
                  {capitalizeFirstLetter(linkType)}
                </option>
              ))}
            </select>
          </div>

          <div className="search-link-row">
            <button className="add-link-button" onClick={handleAddLink}>
              Add Connection
            </button>
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="back" onClick={() => goBack((p) => p - 1)}>
          Back
        </button>
        <button className="primary" type="submit">
          Continue
        </button>
      </div>
    </>
  );
};

export default SecondPageModal;
