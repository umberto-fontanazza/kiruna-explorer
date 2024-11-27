import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import "../styles/DatePick.scss";

const Datepick = () => {
  // Stati per la gestione del range di date
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() + 3)),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Funzione di gestione del range
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start ?? undefined);
    setEndDate(end ?? undefined);
  };

  return (
    <div className="relative px-1">
      <DatePicker
        wrapperClassName="input-attribute"
        className="bg-white appearance-none rounded-lg shadow border-black text-black"
        showIcon
        withPortal
        excludeDateIntervals={[
          {
            start: new Date(),
            end: new Date(new Date().setDate(new Date().getDate() + 2)),
          },
        ]}
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        monthsShown={1}
        showYearDropdown
        dateFormatCalendar="MMMM"
        yearDropdownItemNumber={15}
        scrollableYearDropdown
        renderCustomHeader={({
          monthDate,
          customHeaderCount,
          decreaseMonth,
          increaseMonth,
        }) => (
          <div>
            <button
              aria-label="Previous Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--previous"
              }
              style={
                customHeaderCount === 1 ? { visibility: "hidden" } : undefined
              }
              onClick={decreaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                }
              >
                {"<"}
              </span>
            </button>
            <span className="react-datepicker__current-month">
              {monthDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              aria-label="Next Month"
              className={
                "react-datepicker__navigation react-datepicker__navigation--next"
              }
              style={
                customHeaderCount === 0 ? { visibility: "hidden" } : undefined
              }
              onClick={increaseMonth}
            >
              <span
                className={
                  "react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                }
              >
                {">"}
              </span>
            </button>
          </div>
        )}
      />
      <i className="fas fa-calendar absolute top-1/4 right-4 text-black"></i>
    </div>
  );
};

export default Datepick;
