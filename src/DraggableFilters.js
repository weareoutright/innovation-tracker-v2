import React, { useContext } from "react";
import ActiveContext from "./context/ActiveContext";

import { useDrag } from "react-dnd";
import { ItemTypes } from "./constants/dragTypes.js";
import labels from "./constants/labels";

const DraggableFilter = ({ isDragging, text }) => {
  const { active, setActive } = useContext(ActiveContext);
  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: ItemTypes.FILTER,
      item: { text },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );
  const onClick = () => {
    const nextActive = active.findIndex((a) => a === null);
    if (nextActive !== -1 && active.indexOf(text) === -1) {
      active[nextActive] = text;
      setActive([...active]);
    }
  };
  return (
    <li
      ref={dragRef}
      style={{ opacity }}
      className={`filters__filter filters__filter-${text} ${
        active.includes(text) ? "active-filter" : ""
      }`}
      key={text}
      onClick={onClick}
    >
      {labels.getLabel(text)}
    </li>
  );
};

const DraggableFilters = (props) => {
  return (
    <div className="component-filters">
      <ul name="filter__pills" className={`filters__filters list-unstyled`}>
        <label htmlFor="filter__pills" className="filters__label">
          Filters:{" "}
        </label>
        {props.filters.map((filter) => (
          <DraggableFilter key={filter} text={filter} />
        ))}
      </ul>
    </div>
  );
};

export default DraggableFilters;
