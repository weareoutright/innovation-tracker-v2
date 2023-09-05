import React from "react";

const DataYearSelect = ({ handleYearChange, dataYears }) => {
  return (
    <div className="container">
      <form className="DataYearSelect" onChange={handleYearChange}>
        <select className="data-year" name="data-year">
          {dataYears.map((year) => {
            return (
              <option key={year} value={year}>
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
