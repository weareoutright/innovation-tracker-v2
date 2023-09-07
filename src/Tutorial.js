import React, { useContext } from "react"
import ActiveContext from './context/ActiveContext'
import HelpersContext from './context/HelpersContext'

// import DraggableFilters from "./DraggableFilters"

const Tutorial = props => {

  const toggleShowHelpers = () => {
    setShowHelpers(!showHelpers);
  }

  const {active, setActive} = useContext(ActiveContext);
  const {showHelpers, setShowHelpers} = useContext(HelpersContext);

  return (
    <React.Fragment>
      {showHelpers && active[0] == null && 
        <div className="helper helper-primary">
          <small>Step 1 of 3 <em onClick={toggleShowHelpers}>Skip Tutorial</em></small>
          <strong>Drag a filter from below to begin.</strong>
          {/*<DraggableFilters  filters={groups} />*/}
        </div>
      }
      {showHelpers && active[0] != null && active[1] == null && 
        <div className="helper helper-secondary">
          <small>Step 2 of 3</small>
          <strong>Select another filter to compare.</strong>
        </div>
      }
      {showHelpers && active[0] != null && active[1] != null && 
        <div className="helper helper-tertiary">
          <small>Step 3 of 3</small>
          <strong>Explore further<br /> or export.</strong>
          <p><a className="btn" onClick={toggleShowHelpers}>Start</a></p>
        </div>
      }
    </React.Fragment>
  )
}

export default Tutorial;