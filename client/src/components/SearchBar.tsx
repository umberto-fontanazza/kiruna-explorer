import React, { useEffect, useState } from "react";
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
  const [query, setQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const [linkType, setLinkType] = useState(LinkType.Direct);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Document[]>(
    [],
  );
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    setQuery(userInput);

    if (userInput.length >= 2) {
      const lowerCaseQuery = userInput.toLowerCase();

      const startsWithQuery = searchableDocuments.filter((doc) =>
        doc.title.toLowerCase().startsWith(lowerCaseQuery),
      );

      const containsQuery = searchableDocuments.filter(
        (doc) =>
          !startsWithQuery.includes(doc) &&
          doc.title.toLowerCase().includes(lowerCaseQuery),
      );

      setFilteredSuggestions([...startsWithQuery, ...containsQuery]);
    } else {
      setFilteredSuggestions([]);
    }

    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion: Document) => {
    setQuery(suggestion.title);
    setSelectedDocument(suggestion);
    setShowSuggestions(false);
  };

  const handleAddLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedDocument?.id && linkType) {
      const targetDocumentId = selectedDocument.id;
      const existingLink = tableLinks.find(
        (link) => link.targetDocumentId === targetDocumentId,
      );

      if (existingLink) {
        setTableLinks((prev) =>
          prev.map((link) =>
            link.targetDocumentId === targetDocumentId &&
            !link.linkTypes.includes(linkType)
              ? { ...link, linkTypes: [...link.linkTypes, linkType] }
              : link,
          ),
        );
      } else {
        setTableLinks((prev) => [
          ...prev,
          { targetDocumentId, linkTypes: [linkType] },
        ]);
      }
    }
  };

  return (
    <div className="search-bar">
      <div className="search-bar-row">
        <div className="search-input-container">
          <img src="magnifying-glass.png" className="search-icon-mg" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a document"
            value={query}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
          />
          <img
            src="x-black.png"
            className="search-icon-x"
            onClick={() => setQuery("")}
          />
        </div>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <option
                key={suggestion.id}
                className="suggestion-item"
                onMouseDown={() => selectSuggestion(suggestion)}
                tabIndex={0}
                role="button"
              >
                {suggestion.title}
              </option>
            ))}
          </div>
        )}
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

      <div className="search-bar-row">
        <button className="add-link-button" onClick={handleAddLink}>
          Add Link
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
