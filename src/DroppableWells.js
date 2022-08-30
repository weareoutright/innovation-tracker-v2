import React, { useState, useContext } from "react"
import ActiveContext from './context/ActiveContext'

import { useDrop } from 'react-dnd'
import { ItemTypes } from './constants/dragTypes.js'

const DroppableWell = props => {
  const {active, setActive} = useContext(ActiveContext);
  const [hasDropped, setHasDropped] = useState(false)

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.FILTER,
      drop: (item) => {
        active[props.well] = item.text;
        setActive([...active]);
        setHasDropped(true);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver()
      })
    }),
    []
  )
  return (
    <div ref={drop} className={`wells__well wells__well-${props.well}${isOver ? ' wells__well-hover' : ''}${hasDropped ? ' wells__well-active' : ''}`}></div>
  )
}

const DroppableWells = props => {
  const {active, setActive} = useContext(ActiveContext);

  return (
    <div className="component-wells">
      <div className="wells__wrapper">
        <div className="wells__wells">
          {[0,1,2].map(well => <DroppableWell key={well} well={well} />)}
        </div>
      </div>
    </div>
  )
}

export default DroppableWells;

