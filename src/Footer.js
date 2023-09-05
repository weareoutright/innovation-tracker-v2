import React, { useEffect, useRef, useState } from "react"
import groups from "./constants/groups"

import DraggableFilters from "./DraggableFilters"
import DownloadTrigger from "./DownloadTrigger"
import Stickies from "./Stickies"

const Footer = props => {
  return (
    <footer className="app-footer">
      <div className="footer__wrapper">
        <DraggableFilters filters={groups} />
        <DownloadTrigger />
        <Stickies />
      </div>
    </footer>
  )
}

export default Footer;