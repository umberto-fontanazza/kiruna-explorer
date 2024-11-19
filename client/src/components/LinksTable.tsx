import { SetStateAction } from "react";
import "../styles/LinksTable.scss";
import { Document, Link, LinkType } from "../utils/interfaces";

interface LinksTableProps {
  tableLinks: Link[];
  setTableLinks: React.Dispatch<SetStateAction<Link[]>>;
  documents: Document[];
}

function LinksTable({ tableLinks, setTableLinks, documents }: LinksTableProps) {
  // Create a map of document IDs for quick lookup
  const documentMap = documents.reduce(
    (acc, document) => {
      acc[document.id] = document;
      return acc;
    },
    {} as Record<string, Document>
  );

  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    link: Link,
    type: LinkType
  ) => {
    e.preventDefault();
    setTableLinks((prev: Link[]) => {
      return prev
        .map((l) => updateLink(l, link, type))
        .filter((l): l is Link => l !== null); // Filter out the nulls
    });
  };

  const updateLink = (
    link: Link,
    linkToRemoveFrom: Link,
    typeToRemove: LinkType
  ): Link | null => {
    if (link === linkToRemoveFrom) {
      const updatedTypes = link.type.filter((t) => t !== typeToRemove);
      if (updatedTypes.length > 0) {
        return { ...link, type: updatedTypes };
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
          <span className="link-type">{type}</span>
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
    <table className="links-table">
      <thead>
        <tr>
          <th>Icon</th>
          <th>Title</th>
          <th>Link Type</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tableLinks.map((link, index) =>
          Array.isArray(link.type) && link.type.length > 0
            ? link.type.map((type) => renderLinkRow(link, type, index))
            : null
        )}
      </tbody>
    </table>
  );
}

export default LinksTable;
