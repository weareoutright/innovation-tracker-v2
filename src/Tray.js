import React, { useEffect, useRef, useState, useContext } from "react";
import GraphContext from './context/GraphContext'
import SelectedContext from './context/SelectedContext'
import HighlightedContext from './context/HighlightedContext'
import ActiveContext from './context/ActiveContext'
import TrayContext from './context/TrayContext'
import labels from './constants/labels'
import {mappedGroups} from './constants/groups'

import TrayEntry from './TrayEntry'
import Sankey from "./Sankey";

import utils from "./utils"

const organizeTooltipData = summary => {
  let summaryList = Object.entries(summary).sort((a,b) => {
    if (a[1] > b[1]) return -1;
    if (a[1] < b[1]) return 1;
    return 0;
  });

  const summaryLimit = 30;

  if (summaryList.length > summaryLimit) {
    const otherTotal = summaryList.slice(summaryLimit-1).reduce((a,b) => a + b[1],0);
    summaryList = summaryList.slice(0,summaryLimit-1);
    summaryList.push(["Other",otherTotal]);
  }

  summary = {};
  summaryList.forEach(item => summary[item[0]] = item[1]);
  
  return summary;
}

const nodeIsNode = node => node.sourceLinks != undefined;

const initGroupedNode = (selected,active) => {
  let selectedNodes = selected.filter(s => s !== null);
  if (selectedNodes.length) {
    let name = `${labels.getLabel(selectedNodes[0])}${selectedNodes[1] ? ' & ' + labels.getLabel(selectedNodes[1]) : ''}`;
    const node = {
      node: {
        name:name,
        value:0,
        sourceLinks:[],
        targetLinks:[],
        type: active[0]
      },
      source:{},
      target:{}
    };
    if (active[0] === 'agency') {
      node.node.agencyHierarchy = [];
    }
    return node;
  }
  return false;
}

const Tray = props => {

  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {selected, setSelected} = useContext(SelectedContext);
  const {active,setActive} = useContext(ActiveContext);
  const {graph, setGraph} = useContext(GraphContext);
  const {showTray, setShowTray} = useContext(TrayContext);

  const primary = highlighted.primary;
  let isNode,isLink,summaries,grouped;

  const getSummary = (node,type) => {
    if (!active[0] || !active[1]) return null;
    const isNode = nodeIsNode(node);
    const links = type === 'source' ? 'targetLinks' : 'sourceLinks';
    const summary = (!isNode || node[links].length === 0) ? {} : node[links].reduce((obj,l) => {
      if (l[type].name !== node.name) {
        if (!obj[l[type].name]) obj[l[type].name] = 0;
        obj[l[type].name] += l.value/node.value;
      }
      return obj;
    },{});
    return organizeTooltipData(summary);
  }

  if (graph && graph.valid) {
    if (primary) {
      isNode = nodeIsNode(primary);
      isLink = !isNode;

      summaries = [{
        node: primary,
        source: getSummary(primary,'source'),
        target: getSummary(primary,'target')
      }]
    } else {
      summaries = [];
      grouped = (selected[0] || selected[1]) ? initGroupedNode(selected,active) : null;
      graph.nodes.forEach(node => {
        if (node.type === active[0] && active[node.well] && (!node.targetLinks.length || node.targetLinks[0].source.name !== node.name)) {
          const sourceSummary = getSummary(node,'source');
          const targetSummary = getSummary(node,'target');
          summaries.push({
            node:node,
            source:sourceSummary,
            target:targetSummary
          })
          if (grouped) {
            grouped.node.value += node.value;
            //grouped.node.sourceLinks = grouped.node.sourceLinks.concat(node.sourceLinks);
            //grouped.node.targetLinks = grouped.node.targetLinks.concat(node.targetLinks);
            for (let key in sourceSummary) {
              if (!grouped.source[key]) grouped.source[key] = 0;
              grouped.source[key] += sourceSummary[key];
              if (!grouped.target[key]) grouped.target[key] = 0;
              grouped.target[key] += targetSummary[key];
            }
          }
        }
      })
    }
  }

  return (active[0] && summaries &&
    <aside className="component-tray">
      <div className="tray__trigger" onClick={() => setShowTray(!showTray)}>
        {!showTray ? "Details" : "Hide"}
      </div>
      <div className="tray__content">
        {primary && <TrayEntry node={summaries[0].node} summaries={summaries[0]} truncated={true} shortYear={props.shortYear}></TrayEntry>}
        {!primary && grouped && <TrayEntry node={grouped.node} summaries={grouped} shortYear={props.shortYear}></TrayEntry>}
        {(selected[0] || selected[1]) && 
          <Sankey mini={true} />
        }
        {!primary && summaries.map((summary,s) => {
          return (
            <TrayEntry node={summary.node} summaries={summary} key={s} shortYear={props.shortYear}></TrayEntry>
          )
        })}
      </div>
    </aside>
  )
}

export default Tray;