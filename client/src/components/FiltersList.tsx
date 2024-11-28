import { Dispatch, FC, SetStateAction } from "react";
import "../styles/FiltersList.scss";
import {
  DocumentType,
  documentTypeDisplay,
  Filters,
  ScaleType,
  scaleTypeDisplay,
} from "../utils/interfaces";
import Datepick from "./DatePick";

interface FiltersListProps {
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const FiltersList: FC<FiltersListProps> = ({ setFilters }) => {
  return (
    <div className="filters">
      <div className="filter">
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
        <select
          id="scale-type"
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
        <Datepick setFilters={setFilters} />
        {/* <label>
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
          </label> */}
      </div>
    </div>
  );
};

export default FiltersList;
