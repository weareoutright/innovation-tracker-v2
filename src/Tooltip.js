import React, { useEffect, useRef, useState, useContext } from "react";
import GraphContext from './context/GraphContext'
import HighlightedContext from './context/HighlightedContext'
import ActiveContext from './context/ActiveContext'
import labels from './constants/labels'
import {mappedGroups} from './constants/groups'

import utils from "./utils"

const organizeTooltipData = summary => {
  let summaryList = Object.entries(summary).sort((a,b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });

  const summaryLimit = 6;

  if (summaryList.length > summaryLimit) {
    const otherTotal = summaryList.slice(summaryLimit-1).reduce((a,b) => a + b[1],0);
    summaryList = summaryList.slice(0,summaryLimit-1);
    summaryList.push(["Other",otherTotal]);
  }

  summary = {};
  summaryList.forEach(item => summary[item[0]] = item[1]);
  
  return summary;
}

const Tooltip = ({opts, shortYear}) => {
  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {active,setActive} = useContext(ActiveContext);
  const {graph, setGraph} = useContext(GraphContext);

  const primary = highlighted.primary;
  let primaryHeader,primaryBreakdown,secondaryHeader,secondaryBreakdown;
  const isNode = primary.sourceLinks != undefined;
  const isLink = !isNode;
  let total = graph.total;
  let trueTotal = graph.trueTotal;

  const percentage = utils.toPercentage(primary.value/total);
  const truePercentage = utils.toPercentage(primary.value/trueTotal);
  const amount = utils.toCurrency(primary.value);

  let sourceSummary = (!isNode || primary.targetLinks.length === 0) ? {} : primary.targetLinks.reduce((obj,l) => {
    if (!obj[l.source.name]) obj[l.source.name] = 0;
    obj[l.source.name] += l.value/primary.value;
    return obj;
  },{});

  let targetSummary = (!isNode || primary.sourceLinks.length === 0) ? {} : primary.sourceLinks.reduce((obj,l) => {
    if (!obj[l.target.name]) obj[l.target.name] = 0;
    obj[l.target.name] += l.value/primary.value;
    return obj;
  },{});

  sourceSummary = organizeTooltipData(sourceSummary);
  targetSummary = organizeTooltipData(targetSummary);

  if (active[1] && isNode) {
    return (
      <div style={{top:opts.y,left:opts.x}} className={`component-tooltip ${isNode ? 'tooltip-node' : 'tooltip-link'}`}>
        <div className="tooltip__wrapper">
          {isNode != false &&
            <div className="tooltip__content">
              <div className="primary">
                <div className="header-primary">
                  <strong>{primary.type === 'agency' 
                      ? (
                        <React.Fragment>
                        {primary.agencyHierarchy.map(a => `${a} > `)}
                        {labels.getLabel(primary.name)}
                        </React.Fragment>
                      )
                      : (
                        <React.Fragment>
                        {labels.getLabel(primary.name)}
                        </React.Fragment>
                      )
                    }</strong>
                </div>
              </div>
            </div>
          }
          {/*{isNode != false && 
            <div className="tooltip__content">
              <div className="primary">
                <div className="header-primary">
                  In FY 20{shortYear}, <strong>{labels.getLabel(primary.name)}</strong> climate innovation funding <strong>({percentage})</strong> 
                  {primary.targetLinks.length != 0 && 
                    ' came from:'
                  }
                  {primary.targetLinks.length == 0 && 
                    ' was allocated to:'
                  }
                </div>
                <ul className="breakdown">
                  {primary.targetLinks.length != 0 && Object.entries(sourceSummary).map(([key, value]) => {
                    return (
                      <li className="tooltip-link" key={key}><label>{labels.getLabel(key)}:</label> {utils.toPercentage(value)}</li>
                    )
                  })}
                  {primary.targetLinks.length == 0 && Object.entries(targetSummary).map(([key, value]) => {
                    return (
                      <li className="tooltip-link" key={key}><label>{labels.getLabel(key)}:</label> {utils.toPercentage(value)}</li>
                    )
                  })}
                </ul>
              </div>
              
              {primary.targetLinks.length != 0 && primary.sourceLinks.length != 0 && 
                <div className="secondary">
                  <div className="header-secondary">
                    That amount was allocated to:
                  </div>
                  <ul className="breakdown">
                    {Object.entries(targetSummary).map(([key, value]) => {
                      return (
                        <li className="tooltip-link" key={key}><label>{labels.getLabel(key)}:</label> {utils.toPercentage(value)}</li>
                      )
                    })}
                  </ul>
                </div>
              }
            </div>
          }
          {isLink != false && 
            <div className="tooltip__content">
              <div className="primary">
                <div className="header-primary">
                  In FY 20{shortYear}, {utils.toPercentage(primary.value/primary.target.value)} of <strong>{labels.getLabel(primary.target.name)}</strong> climate innovation funding came from <strong>{labels.getLabel(primary.source.name)}</strong>.
                </div>
              </div>
            </div>
          }*/}
        </div>
      </div>
    )
  }

}

export default Tooltip;