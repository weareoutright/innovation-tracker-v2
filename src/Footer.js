import React, { useEffect, useRef, useState } from "react"
import groups from "./constants/groups"

import DraggableFilters from "./DraggableFilters"

const Footer = props => {
  return (
    <footer className="app-footer">
      <DraggableFilters filters={groups}></DraggableFilters>
    </footer>
  )
}

export default Footer;