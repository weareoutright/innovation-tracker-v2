import * as d3 from "d3";
import {sankey as d3sankey, 
  sankeyCenter as d3sankeyCenter, 
  sankeyLeft as d3sankeyLeft, 
  sankeyRight as d3sankeyRight, 
  sankeyJustify as d3sankeyJustify, 
  sankeyLinkHorizontal as d3sankeyLinkHorizontal } from "d3-sankey";
import React, { useEffect, useRef, useState, useContext } from "react";
import GraphContext from './context/GraphContext'
import labels from './constants/labels';
import {mappedGroups} from './constants/groups';

const size = {
  width: 1060,
  height: 600
};

const getMousePosition = event => {
  const CTM = event.target.getScreenCTM();

  return {
    x: (event.clientX - CTM.e) / CTM.a,
    y: (event.clientY - CTM.f) / CTM.d
  };
};

const Rect = ({ index, x0, x1, y0, y1, name, value, length, colors }) => {
  return (
    <>
      <rect
        x={x0}
        y={y0}
        width={x1 - x0}
        height={y1 - y0}
        fill={colors(name)}
        data-index={index}
      />
      <text
        x={(x1 + x0) / 2}
        y={(y1 + y0) / 2}
        style={{
          fill: "#fff",
          alignmentBaseline: "middle",
          fontSize: 16,
          textAnchor: "middle",
          pointerEvents: "none",
          userSelect: "none"
        }}
      >
        {labels[name]}
      </text>
    </>
  );
};

const Link = ({ data, width, length, colors }) => {
  const link = d3sankeyLinkHorizontal();

  return (
    <>
      <defs>
        <linearGradient
          id={`gradient-${data.index}`}
          gradientUnits="userSpaceOnUse"
          x1={data.source.x1}
          x2={data.target.x0}
        >
          <stop offset="0" stopColor={colors(data.source.name)} />
          <stop offset="100%" stopColor={colors(data.target.name)} />
        </linearGradient>
      </defs>
      <path
        d={link(data)}
        fill={"none"}
        stroke={`url(#gradient-${data.index})`}
        strokeOpacity={0.5}
        strokeWidth={width}
      />
    </>
  );
};

const Sankey = props => {

  const {graph, setGraph} = useContext(GraphContext);
  const dragElement = useRef(null);
  const rendered = useRef(null);
  const offset = useRef(null);

  const colors = (name) => {
    let colorGroup = undefined;
    for (let key in mappedGroups) {
      const group = mappedGroups[key];
      const match = group.find(label => label === name);
      if (match) colorGroup = key;
    }
    let color;
    switch (colorGroup) {
      case "stage":
        color = '#029EDA';
      break;
      case "sector":
        color = '#8BD2C1';
      break;
      case "solution":
        color = '#EBB700';
      break;
      default:
        color = '#1D5C42';
      break;
    }
    return color;
  }
  const sankey = d3sankey()
    .nodeAlign(d3sankeyJustify)
    .nodeWidth(200)
    .nodePadding(2)
    .extent([[0, 0], [size.width, size.height]]);

  const onMouseUp = e => {
    dragElement.current = null;
  };

  const onMouseDown = e => {
    if (e.target.tagName === "rect") {
      dragElement.current = e.target;
      offset.current = getMousePosition(e);
      offset.current.y -= parseFloat(e.target.getAttributeNS(null, "y"));
    }
  };

  const onMouseMove = e => {
    if (dragElement.current) {
      const coord = getMousePosition(e);
      dragElement.current.setAttributeNS(null, "y", coord.y - offset.current.y);
    }
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  if (graph && graph.nodes && graph.nodes.length) {
    rendered.current = sankey(graph);
    const { links, nodes } = rendered.current;

    return (
      <svg width={size.width} height={size.height}>
        <g>
          {links.map((d, i) => (
            <Link
              data={d}
              width={d.width}
              length={nodes.length}
              colors={colors}
            />
          ))}
        </g>
        <g>
          {nodes.map((d, i) => (
            <Rect
              index={d.index}
              x0={d.x0}
              x1={d.x1}
              y0={d.y0}
              y1={d.y1}
              name={d.name}
              value={d.value}
              length={nodes.length}
              colors={colors}
            />
          ))}
        </g>
      </svg>
    );
  }

  return <div></div>;
};

export default Sankey;
