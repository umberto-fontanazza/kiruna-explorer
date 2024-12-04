import React, { useEffect, useState } from "react";
import API from "../API/API";
import { useDocumentFormContext } from "../context/DocumentFormContext";
import "../styles/SearchBar.scss";
import { Document } from "../utils/interfaces";
interface SearchBarProps {
  setSelectedSuggestion: React.Dispatch<
    React.SetStateAction<Document | undefined>
  >;
}

function SearchBar({ setSelectedSuggestion }: SearchBarProps) {
  const { searchableDocuments, setSearchableDocuments } =
    useDocumentFormContext();
  const [query, setQuery] = useState("");

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

      const matchesQuery = searchableDocuments
        .filter((doc) => {
          const titleWords = doc.title.toLowerCase().split(/\s+/);

          return lowerCaseQuery
            .split(/\s+/)
            .every((queryPart) =>
              titleWords.some((titleWord) => titleWord.startsWith(queryPart)),
            );
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      setFilteredSuggestions(matchesQuery);
    } else {
      setFilteredSuggestions([]);
    }

    setShowSuggestions(true);
  };

  const selectSuggestion = (suggestion: Document) => {
    setQuery(suggestion.title);
    setSelectedSuggestion(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <div id="search-input-container">
        <img src="magnifying-glass-blue.png" className="search-icon-mg" />
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
          src="search-bar-x.png"
          className="search-icon-x"
          alt="Clear search"
          onClick={() => setQuery("")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setQuery("");
            }
          }}
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
    </>
  );
}

export default SearchBar;
