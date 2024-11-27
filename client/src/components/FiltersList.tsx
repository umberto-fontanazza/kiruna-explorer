import dayjs from "dayjs";
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
}

const FiltersList: FC<FiltersListProps> = ({ filters, setFilters }) => {
  return (
    <>
      <div className="filters">
        <div className="filter">
          Document Type
          <select
            id="document-type"
            required
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                type: e.target.value as DocumentType,
              }));
            }}
          >
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
          <select
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                scaleType: e.target.value as ScaleType,
              }));
            }}
          >
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
            <input
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  minIssuanceDate: e.target.value
                    ? dayjs(e.target.value)
                    : undefined,
                }));
              }}
            />
          </label>
          <label>
            End date:
            <input
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  maxIssuanceDate: e.target.value
                    ? dayjs(e.target.value)
                    : undefined,
                }));
              }}
            />
          </label>
          <button>Filter</button>
        </div>
      </div>
    </>
  );
};

export default FiltersList;
