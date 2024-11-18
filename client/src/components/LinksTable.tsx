import { Document, Link, LinkType } from "../utils/interfaces";
import { SetStateAction } from "react";
import "../styles/LinksTable.scss";

interface LinksTableProps {
  tableLinks: Link[];
  setTableLinks: React.Dispatch<SetStateAction<Link[]>>;
  documents: Document[];
}

function LinksTable({ tableLinks, setTableLinks, documents }: LinksTableProps) {
  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement>,
    link: Link,
    type: LinkType
  ) => {
    e.preventDefault();

    setTableLinks((prev: Link[]) => {
      return prev
        .map((l) => {
          if (l === link) {
            const updatedTypes = l.type.filter((t) => t !== type);

            if (updatedTypes.length > 0) {
              return { ...l, type: updatedTypes };
            }
            return null; // Questo è il caso in cui rimuoviamo il link
          }
          return l;
        })
        .filter((l): l is Link => l !== null); // Filtra i null
    });
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
        {tableLinks.flatMap((link, index) =>
          Array.isArray(link.type) && link.type.length > 0
            ? link.type.map((type) => {
                const document = documents.filter(
                  (doc) => doc.id === link.targetDocumentId
                )[0];
                if (!document) {
                  console.error(
                    `Document with ID ${link.targetDocumentId} not found.`
                  );
                  return null; // Se il documento non esiste, non renderizzare nulla
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
              })
            : null
        )}
      </tbody>
    </table>
  );
}

export default LinksTable;
