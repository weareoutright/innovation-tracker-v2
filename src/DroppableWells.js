import React, { useState, useContext, useEffect } from "react"
import ActiveContext from './context/ActiveContext'
import ReadyContext from './context/ReadyContext'
import SelectedContext from './context/SelectedContext'
import AgencyLevelContext from './context/AgencyLevelContext'

import BudgetChart from "./BudgetChart"

import { FaPlusCircle } from 'react-icons/fa'
import { useDrop } from 'react-dnd'

import { ItemTypes } from './constants/dragTypes.js'

const DroppableWell = props => {
  const {active, setActive} = useContext(ActiveContext);
  const {selected,setSelected} = useContext(SelectedContext);
  const {agencyLevel,setAgencyLevel} = useContext(AgencyLevelContext);
  const {ready, setReady} = useContext(ReadyContext);
  const [hasDropped, setHasDropped] = useState(false);

  const onClickTrigger = () => {
    setReady([true,true]);
  }

  const [{ isOver, canDrop}, drop] = useDrop(
    () => ({
      accept: ItemTypes.FILTER,
      canDrop: (item) => (props.well === 0 || active[props.well-1]) && active.indexOf(item.text) === -1,
      drop: (item) => {        
        const wasActive = active[props.well];
        active[props.well] = item.text;
        setActive([...active]);
        if (wasActive === 'agency') setAgencyLevel(0);
        selected[props.well] = null;
        setSelected([...selected]);
        setHasDropped(true);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    }),
    [active,selected,agencyLevel]
  )

  return (
    <div ref={drop} className={`wells__well wells__well-${props.well}
      ${isOver ? ' wells__well-hover' : ''}
      ${canDrop ? ' wells__well-available' : ''}
      ${active[props.well] ? ' wells__well-active' : ''}
    `}>
      {props.well === 2 && <FaPlusCircle onClick={onClickTrigger} />}
    </div>
  )
}

const DroppableWells = props => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.FILTER,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop()
      })
    }),
    []
  )

  return (
    <div ref={drop} className={`component-wells ${isOver ? ' drop-hover' : ''}`}>
      <div className="wells__wrapper">
        <BudgetChart shortYear={props.shortYear} />
        <div className="wells__wells">
          {[0,1].map(well => <DroppableWell key={well} well={well} />)}
        </div>
      </div>
    </div>
  )
}

export default DroppableWells;

