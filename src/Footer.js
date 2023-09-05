import React, { useEffect, useRef, useState } from "react";
import groups from "./constants/groups";

import DraggableFilters from "./DraggableFilters";
import DownloadTrigger from "./DownloadTrigger";
import Stickies from "./Stickies";
import DataYearSelect from "./DataYearSelect";

const Footer = ({ handleYearChange, dataYears }) => {
  return (
    <footer className="app-footer">
      <div className="footer__wrapper">
        <DataYearSelect
          handleYearChange={handleYearChange}
          dataYears={dataYears}
        />
        <DraggableFilters filters={groups} />
        <DownloadTrigger />
        <Stickies />
      </div>
    </footer>
  );
};

export default Footer;
