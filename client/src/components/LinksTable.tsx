import { Document, Link, LinkType } from "../utils/interfaces";
import { SetStateAction } from "react";

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
            } else {
              return null;
            }
          }
          return l;
        })
        .filter((l) => l !== null);
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
          link.type.map((type) => (
            <tr key={`${index}-${type}`}>
              <td>
                <img
                  className="doc-icon"
                  src={`/document-${documents[link.targetDocumentId].type}-icon.png`}
                  alt="Document icon"
                />
              </td>
              <td className="doc-title">
                {documents[link.targetDocumentId].title}
              </td>
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
          ))
        )}
      </tbody>
    </table>
  );
}

export default LinksTable;
