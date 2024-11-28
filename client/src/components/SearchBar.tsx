import { useEffect, useState } from "react";
import API from "../API/API";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/SearchBar.scss";
import { Document, Link, LinkType } from "../utils/interfaces";
import { capitalizeFirstLetter } from "../utils/utils";

interface SearchBarProps {
  tableLinks: Link[];
  setTableLinks: React.Dispatch<React.SetStateAction<Link[]>>;
}

function SearchBar({ tableLinks, setTableLinks }: SearchBarProps) {
  const { searchableDocuments, setSearchableDocuments } =
    useDocumentFormContext();
  const [query, setQuery] = useState(""); // user input
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [linkType, setLinkType] = useState(LinkType.Direct); // default link type
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents: Document[] = await API.getDocuments();
        setSearchableDocuments(documents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  const handleChange = (e: { target: { value: string } }) => {
    const userInput = e.target.value;
    setQuery(userInput);

    const filtered = searchableDocuments.filter((document) =>
      document.title.toLowerCase().includes(userInput.toLowerCase()),
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
        (link) => link.targetDocumentId === targetDocumentId,
      );

      if (target) {
        setTableLinks((prev: Link[]) => {
          const updatedLinks = prev.map((link) => {
            if (link.targetDocumentId === targetDocumentId) {
              if (!link.linkTypes.includes(type)) {
                return {
                  ...link,
                  linkTypes: [...link.linkTypes, type],
                };
              }
            }
            return link;
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
              linkTypes: [type],
            },
          ];
        });
      }
    }
  };

  return (
    <div className="search-bar">
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  selectSuggestion(suggestion);
                }
              }}
              className="suggestion-item"
              onMouseDown={(e) => e.preventDefault()} // Prevent input from losing focus
              tabIndex={0} // Make the div focusable
              role="button" // Indicates that the div is acting as a button
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
        {Object.values(LinkType).map((linkType) => (
          <option key={linkType} value={linkType}>
            {capitalizeFirstLetter(linkType)}
          </option>
        ))}
      </select>
      <button className="add-link-button" onClick={(e) => handleAddLink(e)}>
        Add Link
      </button>
    </div>
  );
}

export default SearchBar;
