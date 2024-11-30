import { SetStateAction } from "react";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/LinksTable.scss";
import { Document, Link, LinkType } from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

interface LinksTableProps {
  tableLinks: Link[];
  setTableLinks: React.Dispatch<SetStateAction<Link[]>>;
}

function LinksTable({ tableLinks, setTableLinks }: LinksTableProps) {
  const { searchableDocuments } = useDocumentFormContext();
  // Create a map of document IDs for quick lookup
  const documentMap = searchableDocuments.reduce(
    (acc, document) => {
      acc[document.id] = document;
      return acc;
    },
    {} as Record<string, Document>,
  );

  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    link: Link,
    type: LinkType,
  ) => {
    e.preventDefault();
    setTableLinks((prev: Link[]) => {
      return prev
        .map((l) => updateLink(l, link, type))
        .filter((l): l is Link => l !== null);
    });
  };

  const updateLink = (
    link: Link,
    linkToRemoveFrom: Link,
    typeToRemove: LinkType,
  ): Link | null => {
    if (link === linkToRemoveFrom) {
      const updatedTypes = link.linkTypes.filter((t) => t !== typeToRemove);
      if (updatedTypes.length > 0) {
        return { ...link, linkTypes: updatedTypes };
      }
      return null; // Link is completely removed if no types remain
    }
    return link;
  };

  const renderLinkRow = (link: Link, type: LinkType, index: number) => {
    const document = documentMap[link.targetDocumentId];
    if (!document) {
      console.error(`Document with ID ${link.targetDocumentId} not found.`);
      return null;
    }

    return (
      <tr key={`${index}-${type}`}>
        <td>
          <img
            className="doc-icon"
            src={`/document-${document.type}-icon.png`}
            alt="Document icon"
          />
        </td>
        <td className="doc-title">{document.title}</td>
        <td>
          <span className="link-type">{capitalizeFirstLetter(type)}</span>
        </td>
        <td>
          <button
            className="remove-link"
            onClick={(e) => handleRemove(e, link, type)}
          >
            Remove
          </button>
        </td>
      </tr>
    );
  };

  return (
    <table className="links links-table">
      <thead>
        <tr>
          <th>ICON</th>
          <th>TITLE</th>
          <th>LINK TYPE</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {tableLinks.map((link, index) =>
          Array.isArray(link.linkTypes) && link.linkTypes.length > 0
            ? link.linkTypes.map((type) => renderLinkRow(link, type, index))
            : null,
        )}
      </tbody>
    </table>
  );
}

export default LinksTable;
