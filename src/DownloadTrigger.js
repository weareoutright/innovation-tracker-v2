import React, { useState, useContext } from "react";
import ActiveContext from "./context/ActiveContext";
import sources from "./constants/sources";

import * as d3ToPng from "d3-svg-to-png";

const DownloadTrigger = (props) => {
  const { active, setActive } = useContext(ActiveContext);

  const [show, setShow] = useState(false);

  const downloadTriggerClick = () => {
    setShow(!show);
  };

  const downloadFileClick = () => {
    window.open(sources.download);
  };

  const downloadImageClick = () => {
    d3ToPng(".component-sankey:not(.mini) svg", "edf-innovationtracker-chart", {
      format: "png",
      download: true,
      background: "white",
    });
  };

  return (
    <div
      className={`download-trigger ${show ? "show" : ""}`}
      onClick={downloadTriggerClick}
    >
      <div className="download__screen" onClick={downloadTriggerClick}></div>
      <div className={`download__options`}>
        <div className="download__close" onClick={downloadTriggerClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
          </svg>
        </div>
        <h4>Export Options</h4>
        <div
          className="download__option option-file"
          onClick={downloadFileClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path d="M15.95 35.5h16.1v-3h-16.1Zm0-8.5h16.1v-3h-16.1ZM11 44q-1.2 0-2.1-.9Q8 42.2 8 41V7q0-1.2.9-2.1Q9.8 4 11 4h18.05L40 14.95V41q0 1.2-.9 2.1-.9.9-2.1.9Zm16.55-27.7V7H11v34h26V16.3ZM11 7v9.3V7v34V7Z" />
          </svg>
          <label>Download as data (.xlsx)</label>
        </div>
        {active[1] && (
          <div
            className="download__option option-image"
            onClick={downloadImageClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path d="M14.2 34.15h3V23.9h-3Zm16.6 0h3v-21h-3Zm-8.3 0h3v-5.9h-3Zm0-10.25h3v-3h-3ZM9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30ZM9 9v30V9Z" />
            </svg>
            <label>Download as image (.png)</label>
          </div>
        )}
      </div>
      {/* <div className="download__label">Export</div> */}
      <div className="download__button">
        <span>Export</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm13-7.65-9.65-9.65 2.15-2.15 6 6V8h3v18.55l6-6 2.15 2.15Z" />
        </svg>
      </div>
    </div>
  );
};
export default DownloadTrigger;
