import React from "react";

const DataYearSelect = ({ handleYearChange, dataYears }) => {
  return (
    <div className="data-year-container">
      <label htmlFor="data-year-select">Year:</label>
      <form
        name="data-year-select"
        className="DataYearSelect"
        onChange={handleYearChange}
      >
        <select className="data-year" name="data-year">
          {dataYears.map((year, i) => {
            return (
              <option key={i} value={year}>
                FY {year}
              </option>
            );
          })}
        </select>
      </form>
    </div>
  );
};

export default DataYearSelect;
