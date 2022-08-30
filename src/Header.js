import React, { useEffect, useRef, useState, useContext } from "react"
import ActiveContext from './context/ActiveContext'

import labels from './constants/labels'

const Header = props => {

  const {active, setActive} = useContext(ActiveContext);

  return (
    <header className="app-header">
      <div className="component-well-headers">
        <div className="well__headers">
          {active.map((well,w) => <div className={`well__header${well !== null ? ' well__header-active' : ''}`} key={w}>{well !== null && <h2>{labels[well]} <em>100%</em></h2>}</div>)}
        </div>
      </div>
    </header>
  )
}

export default Header;