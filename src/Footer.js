import React from "react";
import groups from "./constants/groups";

import DraggableFilters from "./DraggableFilters";
import DownloadTrigger from "./DownloadTrigger";
import Stickies from "./Stickies";
import DataYearSelect from "./DataYearSelect";

import { BREAKPOINTS } from "./constants/breakpoints";
import useWindowSize from "./useWindowSize";

const Footer = ({ handleYearChange, dataYears, shortYear }) => {
  const { width } = useWindowSize();

  // WORKING ON MOBILE
  if (width > BREAKPOINTS.md) {
    return (
      <footer className="app-footer">
        <div className="footer__wrapper">
          <DataYearSelect
            handleYearChange={handleYearChange}
            dataYears={dataYears}
          />
          <DraggableFilters filters={groups} />
          <DownloadTrigger />
          <Stickies shortYear={shortYear} />
        </div>
      </footer>
    );
  } else if (width <= BREAKPOINTS.md && width > 400) {
    return (
      <footer className="app-footer">
        <div className="footer__wrapper">
          <DraggableFilters filters={groups} />
          <div className="footer-second-row-md-breakpoint">
            <DataYearSelect
              handleYearChange={handleYearChange}
              dataYears={dataYears}
            />
            <DownloadTrigger />
            <Stickies shortYear={shortYear} />
          </div>
        </div>
      </footer>
    );
  } else {
    return (
      <footer className="app-footer">
        <div className="footer__wrapper">
          <DraggableFilters filters={groups} />
          <div className="footer-second-row-md-breakpoint">
            <DataYearSelect
              handleYearChange={handleYearChange}
              dataYears={dataYears}
            />
          </div>
          <div className="footer-third-row-sm-breakpoint">
            <DownloadTrigger />
            <Stickies shortYear={shortYear} />
          </div>
        </div>
      </footer>
    );
  }
};

export default Footer;
