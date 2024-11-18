import { Document, Link, LinkType } from "../utils/interfaces";
import { useState } from "react";

interface SearchBarProps {
  documents: Document[];
  tableLinks: Link[];
  setTableLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

function SearchBar({ documents, tableLinks, setTableLinks }: SearchBarProps) {
  const [query, setQuery] = useState(""); // user input
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [type, setType] = useState(LinkType.Direct); // link type
  const [filteredSuggestions, setFilteredSuggestions] = useState<Document[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e: { target: { value: string } }) => {
    const userInput = e.target.value;
    setQuery(userInput);

    const filtered = documents.filter((document) =>
      document.title.toLowerCase().includes(userInput.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const selectSuggestion = async (suggestion: Document) => {
    setQuery(suggestion.title);
    await setSelectedDocument(suggestion);
    setShowSuggestions(false);
  };

  interface HandleAddLinkEvent {
    preventDefault: () => void;
  }

  const handleAddLink = (e: HandleAddLinkEvent) => {
    e.preventDefault();
    if (selectedDocument?.id !== undefined && type !== undefined) {
      const targetDocumentId = selectedDocument.id;
      const target = tableLinks.find(
        (link) => link.targetDocumentId === targetDocumentId
      );

      if (target) {
        setTableLinks((prev: Link[]) => {
          const updatedLinks = prev.map((link) => {
            if (link.targetDocumentId === targetDocumentId) {
              if (!link.type.includes(type)) {
                return {
                  ...link,
                  type: [...link.type, type],
                };
              }
            }
            return link; // If the link is not the one to update, return it as it is
          });

          // Return the updated links
          return updatedLinks;
        });
      } else {
        setTableLinks((prev: Link[]) => {
          return [
            ...prev,
            {
              targetDocumentId: targetDocumentId,
              type: [type],
            },
          ];
        });
      }
    }
  };

  return (
    <>
      <input
        type="text"
        className="search-input"
        placeholder="Search for a document"
        value={query}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="form-group">
          {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
            <div
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="suggestion-item"
              onMouseDown={(e) => e.preventDefault()} // To prevent the input from losing focus
            >
              {suggestion.title}
            </div>
          ))}
        </div>
      )}
      <select
        onChange={(e) => {
          setType(e.target.value as LinkType);
        }}
      >
        <option value={LinkType.Direct}>Direct</option>
        <option value={LinkType.Collateral}>Collateral</option>
        <option value={LinkType.Projection}>Projection</option>
        <option value={LinkType.Update}>Update</option>
      </select>
      <button onClick={(e) => handleAddLink(e)}>
        <span>Add Link</span>
      </button>
    </>
  );
}

export default SearchBar;
