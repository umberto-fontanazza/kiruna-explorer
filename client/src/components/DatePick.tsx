import dayjs from "dayjs"; // Importiamo Day.js
import { Dispatch, FC, SetStateAction } from "react";
import "../styles/DatePick.scss";
import { Filters } from "../utils/interfaces";

interface DatepickProps {
  setFilters: Dispatch<SetStateAction<Filters>>;
}

const Datepick: FC<DatepickProps> = ({ setFilters }) => {
  // Funzione per gestire la selezione della data dal primo datepicker (minIssuanceDate)
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? dayjs(e.target.value) : undefined; // Converte in Day.js
    setFilters((prevFilters) => ({
      ...prevFilters,
      minIssuanceDate: selectedDate, // Aggiorna minIssuanceDate
    }));
  };

  // Funzione per gestire la selezione della data dal secondo datepicker (maxIssuanceDate)
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value ? dayjs(e.target.value) : undefined; // Converte in Day.js
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxIssuanceDate: selectedDate, // Aggiorna maxIssuanceDate
    }));
  };

  return (
    <div className="date-filters">
      <div className="start">
        <label htmlFor="startDate">From:</label>
        <input
          id="startDate"
          type="date"
          onChange={handleStartDateChange} // Evento onChange per minIssuanceDate
        />
      </div>
      <div className="end">
        <label htmlFor="endDate">To:</label>
        <input
          id="endDate"
          type="date"
          onChange={handleEndDateChange} // Evento onChange per maxIssuanceDate
        />
      </div>
    </div>
  );
};

export default Datepick;
