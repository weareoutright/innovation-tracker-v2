import { useEffect, useContext } from "react"
import isEqual from "lodash/isEqual"

import ActiveContext from './context/ActiveContext'
import GraphContext from './context/GraphContext'

import {mappedGroups as cols} from './constants/groups';

const GraphGenerator = ({data}) => {

  const {active, setActive} = useContext(ActiveContext);
  const {graph, setGraph} = useContext(GraphContext);



  const getNodes = (type) => {
    let nodes = [];
    let col = cols[type];
    if (type === 'agency') {
      nodes = [
        ...new Set(
          data.map(d => d[col] && d[col].length ? d[col].trim() : null)
        )
      ];
    } else {
      nodes = col;
    }
    return nodes.filter(n => n !== null);
  }

  const getDatumValue = (datum,primary,secondary=null) => {
    let valid = datum.include === 'Y' && datum.fy === '2021';
    if (valid) {
      const agency = datum.agency.trim();
      let source_col,target_col;
      switch (active[0]) {
        case 'agency':
          valid = primary === agency;
          source_col = 'program_appr';
        break;
        default:
          valid = parseInt(datum[primary]);
          source_col = primary;
        break;
      }
      if (valid) {
        switch (active[1]) {
          case null:
            valid = valid;
            target_col = source_col;
          break;
          case 'agency':
            valid = secondary === agency;
            target_col = 'program_appr';
          break;
          default:
            valid = parseInt(datum[secondary]);
            target_col = secondary;
          break;
        }
        if (valid) {
          const total = parseInt(datum.program_appr.replace(",",""));
          const source_val = parseInt(datum[source_col].replace(",",""));
          const target_val = parseInt(datum[target_col].replace(",",""));

          valid = total && source_val && target_val;

          if (valid) {
            return (source_val / total) * target_val;
          }
        }

      }
    }
    return null;
  }

  const getLinks = (data,primary,secondary=null) => {
    let links = [];
    if (secondary) {
      primary.forEach(p => {
        secondary.forEach(s => {
          let link = {
            source:localGraph.nodes.indexOf(p),
            target:localGraph.nodes.indexOf(s),
            value:0
          };
          if (link.source !== -1 && link.target !== -1) {
            data.forEach(datum => {
              const value = getDatumValue(datum,p,s);
              if (value) link.value += value;
            })
            if (link.value) {
              links.push(link);
            }
          }
        })
      })
    } else {
      primary.forEach(p => {
        let link = {
          source:localGraph.nodes.indexOf(p),
          value:0
        };
        if (link.source !== -1) {
          data.forEach(datum => {
            const value = getDatumValue(datum,p);
            if (value) link.value += value;
          })
          if (link.value) {
            links.push(link);
          }
        }
      })
    }
    return links;
  }

  let localGraph = {
    nodes: [],
    links: []
  };

  if (active[0]) {

    const primaryNodes = getNodes(active[0]);

    if (active[1] && active[1] !== active[0]) {
      const secondaryNodes = getNodes(active[1]);
      localGraph.nodes = primaryNodes.concat(secondaryNodes);
      localGraph.links = getLinks(data,primaryNodes,secondaryNodes);
    } else {
      localGraph.nodes = primaryNodes;
      localGraph.links = getLinks(data,primaryNodes);
      //Append new copy of nodes so we can do self links
      localGraph.links.forEach(l => {
        l.target = l.source + localGraph.nodes.length
      })
      localGraph.nodes = localGraph.nodes.concat(primaryNodes);
    }

  }

  useEffect(() => {
    if (!graph || !graph.nodes || !isEqual(localGraph.nodes,graph.nodes.map(n => n.name))) {
      localGraph.nodes = localGraph.nodes.map(n => {
        return {'name':n};
      });
      setGraph(localGraph);
    }
  })
  
};

export default GraphGenerator;