import * as d3 from "d3";
import {sankey as d3sankey, 
  sankeyCenter as d3sankeyCenter, 
  sankeyLeft as d3sankeyLeft, 
  sankeyRight as d3sankeyRight, 
  sankeyJustify as d3sankeyJustify, 
  sankeyLinkHorizontal as d3sankeyLinkHorizontal } from "d3-sankey";
import React, { useEffect, useRef, useState, useContext } from "react";
import { FaChevronCircleRight,FaChevronCircleLeft } from 'react-icons/fa'
import isEqual from "lodash/isEqual"

import utils from "./utils"

import GraphContext from './context/GraphContext'
import HighlightedContext from './context/HighlightedContext'
import ActiveContext from './context/ActiveContext'
import ReadyContext from './context/ReadyContext'
import SelectedContext from './context/SelectedContext'
import AgencyLevelContext from './context/AgencyLevelContext'

import labels from './constants/labels';
import {mappedGroups} from './constants/groups';
import { filterColors } from "./constants/filterColors";
import { agencyHierarchy } from "./constants/agencyHierarchy";

import { useDrop } from 'react-dnd'
import { ItemTypes } from './constants/dragTypes.js'


import Tooltip from './Tooltip';

let tooltip = false;

const isMobile = window.innerWidth < 840;

const nodeWidth = isMobile ? 175 : 200;

const highlightItem = (highlighted,target,on,primary=false) => {
  if (primary) highlighted.primary = (on ? target : null);
  target.highlighted = on;
  if (target.sourceLinks) {
    //Node
    if (on) {
      highlighted.nodes.push(target);
    } else {
      highlighted.nodes = highlighted.nodes.filter(n => n.index !== target.index);
    }
  } else {
    //Link
    if (on) {
      highlighted.links.push(target);
    } else {
      highlighted.links = highlighted.links.filter(n => n.index !== target.index);
    }
  }
}

const unHighlight = (highlighted) => {
  highlighted.links.forEach(l => l.highlighted = false);
  highlighted.nodes.forEach(n => n.highlighted = false);
  highlighted = {
    links: [],
    nodes: [],
    primary: null
  }
  return highlighted;
}

const highlightSegment = (highlighted,target,on) => {
  highlighted = unHighlight(highlighted);
  highlightItem(highlighted,target,on,true);
  if (target.sourceLinks) {
    //Node
    const links = target.sourceLinks.concat(target.targetLinks);
    links.forEach(l => {
      highlightItem(highlighted,l, on);
      highlightItem(highlighted,l.target, on);
      highlightItem(highlighted,l.source, on);
    })
  } else {
    //Link
    const nodes = [target.source].concat(target.target);
    nodes.forEach(n => {
      highlightItem(highlighted,n, on);
    })
  }
  return highlighted;
}

function wrapLabel() {
  var self = d3.select(this),
    textLength = self.node().getComputedTextLength(),
    text = self.text();
  while (textLength > (width - 2 * padding) && text.length > 0) {
    text = text.slice(0, -1);
    self.text(text + '...');
    textLength = self.node().getComputedTextLength();
  }
}

const Rect = ({ data, index, x0, x1, y0, y1, label, amountLabel, valueLabel, trueValueLabel, name, value, length, colors, textColors, mini }) => {
  const {selected,setSelected} = useContext(SelectedContext);
  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {active,setActive} = useContext(ActiveContext);
  const {agencyLevel,setAgencyLevel} = useContext(AgencyLevelContext);

  const onMouseMove = e => {
    setHighlighted(highlightSegment(highlighted,data,true));
  };

  const onMouseOut = e => {
    setHighlighted(highlightSegment(highlighted,data,false));
  };

  const handleSelect = e => {
    e.stopPropagation();
    d3.select(e.target.parentNode).raise();
    if (data.type !== 'agency' || agencyLevel < 3) {
      selected[well] = selected[well] && selected[well] === name ? null : name;
      setSelected([...selected]);
      if (data.type === 'agency') setAgencyLevel(agencyLevel >= 3 ? 3 : agencyLevel + 1);
    }
  }

  const well = data.well;
  const height = y1 - y0;
  const width = x1 - x0;
  const midX = (x1 + x0) / 2;
  const midY = (y1 + y0) / 2;

  const labelLimit = (isMobile ? 10 : 20) - (data.type === 'agency' ? 2 * agencyLevel : 0);

  label = label.length > labelLimit ? label.slice(0,labelLimit) + "..." : label;
  valueLabel = valueLabel.length > labelLimit ? valueLabel.slice(0,labelLimit) + "..." : valueLabel;
  trueValueLabel = trueValueLabel.length > labelLimit ? trueValueLabel.slice(0,labelLimit) + "..." : trueValueLabel;

  const isHighlighted = data.highlighted || highlighted.nodes.find(n => n.name === data.name && n.well === data.well);

  return (
    <>
      <g 
        className={`node node-well-${data.well}${data.selected ? ' selected' : ''}${isHighlighted ? ' highlight' : ''} level-${(data.type === 'agency' ? agencyLevel : 0)}`}
        onClick={handleSelect}
        onMouseOut={onMouseOut}
        onMouseMove={onMouseMove}>
        <rect
          x={x0}
          y={y0}
          width={width}
          height={height}
          fill={colors(name)}
          data-index={index}
          strokeDasharray={y0 > 0 ? `${nodeWidth - (20 * (data.type === 'agency' ? agencyLevel : 0))},${height * 2 + width}` : `0,${height * 2 + width * 2}`}
        />
        {!mini &&
          <text
            x={midX}
            y={midY}
            style={{
              fill: textColors(name),
              fontSize: 16,
              textAnchor: "middle",
              pointerEvents: "none",
              userSelect: "none"
            }}
          >
            {height > 10 && 
              <tspan x={(x1 + x0) / 2} dy={height > 40 ? 0 : 6} textAnchor="middle">{label}</tspan>
            }
            {height > 40 && 
              <tspan x={(x1 + x0) / 2} dy="18" textAnchor="middle" style={{fontSize: 12}}>{data.type === 'agency' ? `${amountLabel} (${valueLabel})` : `${valueLabel}`}</tspan>
            }
            {/*{valueLabel !== trueValueLabel && height > 52 && 
              <tspan x={(x1 + x0) / 2} dy="16" textAnchor="middle" style={{fontSize: 10}}>({trueValueLabel} of total)</tspan>
            }*/}
          </text>
        }
        {!mini && data.type === 'agency' && agencyLevel < 3 && well === 0 &&
          <FaChevronCircleRight 
            onClick={handleSelect}
            y={midY-8}
            x={x1-20}
          />
        }
        {!mini && data.type === 'agency' && agencyLevel < 3 && well === 1 &&
          <FaChevronCircleLeft 
            onClick={handleSelect}
            y={midY-8}
            x={x0+2}
          />
        }
      </g>
    </>
  );
};

const Link = ({ data, index, width, length, colors, textColors, mini }) => {

  const link = d3sankeyLinkHorizontal();
  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {selected,setSelected} = useContext(SelectedContext);
  const {active,setActive} = useContext(ActiveContext);

  const sourceWell = data.source.well;
  const targetWell = data.target.well;


  const onMouseMove = e => {
    setHighlighted(highlightSegment(highlighted,data,true));
  };

  const onMouseOut = e => {
    setHighlighted(highlightSegment(highlighted,data,false));
  };

  const isHighlighted = data.highlighted || highlighted.links.find(l => l.source.name === data.source.name && l.target.name === data.target.name);

  const id = (mini ? 'mini' : '') + data.index;

  return (
    <>
      <g 
        className={`link ${isHighlighted ? 'highlight' : ''}${data.selected ? ' selected' : ''}`}
        onMouseMove={onMouseMove}
        onMouseOut={onMouseOut}>
        <defs>
          <linearGradient
            id={`gradient-${id}`}
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
          stroke={`url(#gradient-${id})`}
          strokeOpacity={0.5}
          strokeWidth={width}
        />
      </g>
    </>
  );
};

const Sankey = props => {

  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {selected,setSelected} = useContext(SelectedContext);
  const {graph, setGraph} = useContext(GraphContext);
  const {ready, setReady} = useContext(ReadyContext);
  const {active, setActive} = useContext(ActiveContext);
  const {agencyLevel, setAgencyLevel} = useContext(AgencyLevelContext);
  const rendered = useRef(null);
  const offset = useRef(null);
  const mini = props.mini;

  const component = document.querySelector(".app-main .sankey-spacer");

  let size = props.mini ? {
    height:195,
    width:292
  } : {
    width: component ? component.getBoundingClientRect().width : 0,
    height: component ? component.getBoundingClientRect().height - 5 : 0
  };

  const sankeyGraph = props.mini ? graph.raw : graph;

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
        color = filterColors.stage;
      break;
      case "sector":
        color = filterColors.sector;
      break;
      case "solution":
        color = filterColors.solution;
      break;
      case "funding_type":
        color = filterColors.funding_type;
      break;
      case "funding_source":
        color = filterColors.funding_source;
      break;
      default:
        color = filterColors.default;
      break;
    }
    return color;
  }
  const textColors = (name) => {
    let colorGroup = undefined;
    for (let key in mappedGroups) {
      const group = mappedGroups[key];
      const match = group.find(label => label === name);
      if (match) colorGroup = key;
    }
    let color;
    switch (colorGroup) {
      case "solution":
      case "sector":
      case "funding_type":
        color = '#000';
      break;
      default:
        color = '#fff';
      break;
    }
    return color;
  }

  const totalActive = active.filter(a => a !== null).length;
  const totalReady = ready.filter(r => r !== false).length;

  const sankey = d3sankey()
    .nodeAlign(d3sankeyJustify)
    .nodeWidth(mini ? 54 : nodeWidth)
    .nodePadding(0)
    .nodeSort(null)
    .extent([[0, 0], [(totalActive == 2 && totalReady == 3 ? 630 : size.width), size.height]]);

  const onMouseMove = e => {
    const bounds = e.target.closest('.component-sankey > svg').getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    tooltip = {
      x: x,
      y: y
    };
  }

  const onMouseOut = e => {
    tooltip = false;
  }

  const handleAgencyGroupingClick = e => {
    const target = e.target.closest('g');
    const parent = target.getAttribute('parent');
    const well = target.getAttribute('well');
    selected[well] = parent;
    setSelected([...selected]);
    setAgencyLevel(parseInt(target.getAttribute('index')));
  }

  const hasHighlight = highlighted.nodes.length || highlighted.links.length;

  if (sankeyGraph && sankeyGraph.valid) {
    rendered.current = sankey({nodes:sankeyGraph.nodes,links:sankeyGraph.links});
    const { links, nodes } = rendered.current;
    let total = sankeyGraph.total;
    let trueTotal = sankeyGraph.trueTotal;

    let activeAgencyHierarchy = [];
    const updateAgencyHierarchy = (node,activeAgencyHierarchy) => {
      let diff = [];
      for (let level=0;level<agencyLevel;level++) {
        if (node.agencyHierarchy[level] && activeAgencyHierarchy[level] !== node.agencyHierarchy[level]) {
          diff[level] = true;
          activeAgencyHierarchy[level] = node.agencyHierarchy[level];
        }
      }
      return diff;
    }

    return (
      <div className={`component-sankey${ isOver ? ' drop-hover' : ''}${mini ? ' mini' : ''}${ hasHighlight ? ' highlight' : ''}`}>
        <svg ref={drop} 
          width="100%"
          height="100%"
          viewBox={`0 0 ${size.width} ${size.height}`}
          preserveAspectRatio="xMinYMin"
          onMouseMove={onMouseMove}
          onMouseOut={onMouseOut}>
          <g className="links">
            {links.map((d, i) => (
              <Link
                data={d}
                index={d.index}
                width={d.width}
                length={nodes.length}
                colors={colors}
                textColors={textColors}
                mini={mini}
              />
            ))}
          </g>
          <g className="nodes">
            {nodes.map((d, i) => (
              <Rect
                data={d}
                index={d.index}
                x0={d.x0 + 20 * ((!mini && d.type === 'agency' && d.well === 0) ? agencyLevel : 0)}
                x1={d.x1 - 20 * ((!mini && d.type === 'agency' && d.well === 1) ? agencyLevel : 0)}
                y0={d.y0}
                y1={d.y1}
                label={labels.getLabel(d.name)}
                amountLabel={utils.toMillions(d.value,1)}
                valueLabel={utils.toPercentage(d.value/total)}
                trueValueLabel={utils.toPercentage(d.value/trueTotal)}
                name={d.name}
                value={d.value}
                length={nodes.length}
                colors={colors}
                textColors={textColors}
                mini={mini}
              />
            ))}
          </g>
          {!mini && 
            <g className="hierarchy">
              {nodes.map((d, i) => {
                const well = d.well;
                if (d.type === 'agency' && (well === 0 || active[1])) {
                  const diff = updateAgencyHierarchy(d,activeAgencyHierarchy);
                  return (
                    <React.Fragment>
                      {activeAgencyHierarchy.map((h,j) => {
                        if (diff[j] && d.agencyHierarchy[j]) {
                          const hierarchyNodes = nodes.filter(n => n.well === well 
                              && (n.height > 0 || n.y0 !== n.y1)
                              && n.agencyHierarchy[j] === d.agencyHierarchy[j]).sort((a,b) => {
                            if (a.index < b.index) return -1;
                            if (a.index > b.index) return 1;
                            return 0;
                          });
                          const first = hierarchyNodes.find(n => n.y0 === Math.min(...hierarchyNodes.map(n => n.y0)));
                          const last = hierarchyNodes.find(n => n.y1 === Math.max(...hierarchyNodes.map(n => n.y1)));
                          const width = 20;
                          const x0 = well === 0 ? first.x0 + width * j : first.x1 - width * (j+1);
                          const y0 = first.y0;
                          const height = last.y1 - first.y0;
                          let label = last.agencyHierarchy[j];
                          const labelLimit = parseInt(height/8);
                          if (label && label.length > labelLimit - 1) label = label.slice(0,labelLimit > 1 ? labelLimit - 1 : 0) + (labelLimit > 1 ? "..." : "");
                          return (
                            <g className="agency-grouping"
                              index={j}
                              node={last.agencyHierarchy[j]}
                              parent={last.agencyHierarchy[j-1]}
                              well={well}
                              onClick={handleAgencyGroupingClick}>
                              <rect 
                                x={x0}
                                y={y0}
                                width="20"
                                height={height}>
                              </rect>
                              {well === 0 && (
                                <FaChevronCircleLeft
                                  x={x0 + width/2 - 8}
                                  y={y0 + 2}/>
                              )}
                              {well !== 0 && (
                                <FaChevronCircleRight
                                  x={x0 + width/2 - 8}
                                  y={y0 + 2}/>
                              )}
                              <text
                                x={x0 + width/2}
                                y={y0 + height/2}
                                transform={`rotate(90,${x0 + width/2},${y0 + height/2})`}>
                              { label }
                              </text>
                            </g>
                          )
                        }
                      })}
                    </React.Fragment>
                  )
                }
              })}
            </g>
          }
        </svg>
        {!props.mini && tooltip !== false && highlighted.primary != undefined && <Tooltip opts={tooltip} />}
      </div>
    );
  }

  return <div></div>;
};

export default Sankey;
