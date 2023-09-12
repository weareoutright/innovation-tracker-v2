import { useDrop } from 'react-dnd';
import { ItemTypes } from './constants/dragTypes.js'

import Sankey from "./Sankey";
import DroppableWells from "./DroppableWells";
import Tutorial from "./Tutorial";

const AppCore = props => {

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
    <div ref={drop} className={`app-main-content${ isOver ? ' drop-hover' : ''}`}>
      <div className="sankey-spacer"></div>
      <Tutorial />
      <DroppableWells shortYear={props.shortYear}/>
      <Sankey mini={false}/>
    </div>
  )

}

export default AppCore;