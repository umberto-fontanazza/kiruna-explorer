import { Dispatch, FC, SetStateAction } from "react";
import {
  DocumentType,
  documentTypeDisplay,
  Filters,
  ScaleType,
  scaleTypeDisplay,
} from "../utils/interfaces";

interface FiltersListProps {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  handleFilters: (filters: Filters) => void;
}

const FiltersList: FC<FiltersListProps> = () => {
  return (
    <>
      <div className="filters">
        <div className="filter">
          Document Type
          <select id="document-type" required>
            <option disabled selected hidden value="">
              Select document type
            </option>
            {Object.values(DocumentType).map((value) => (
              <option value={value}>{documentTypeDisplay[value]}</option>
            ))}
            <option value={""}>No filter</option>
          </select>
        </div>
        <div className="filter">
          Scale Type
          <select>
            <option disabled selected hidden value="">
              Select scale type
            </option>
            {Object.values(ScaleType).map((value) => (
              <option value={value}>{scaleTypeDisplay[value]}</option>
            ))}
            <option value={""}>No filter</option>
          </select>
        </div>
        <div className="date-filter">
          <label>
            Start date:
            <input type="date" />
          </label>
          <label>
            End date:
            <input type="date" />
          </label>
          <button>Filter</button>
        </div>
      </div>
    </>
  );
};

export default FiltersList;
