import React, { useEffect, useRef, useState } from "react"

import { useDrag } from 'react-dnd'
import { ItemTypes } from './constants/dragTypes.js'
import labels from './constants/labels'

const DraggableFilter = ({isDragging,text}) => {
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.FILTER,
      item: { text },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )
  return (
    <li ref={dragRef} style={{ opacity }} className="filters__filter" key={text}>{labels[text]}</li>
  )
}

const DraggableFilters = props => {
  return (
    <div className="component-filters">
      <div className="filters__wrapper">
        <ul className="filters__filters list-unstyled">
          {props.filters.map(filter => <DraggableFilter key={filter} text={filter} />)}
        </ul>
      </div>
    </div>
  )
}

export default DraggableFilters;

