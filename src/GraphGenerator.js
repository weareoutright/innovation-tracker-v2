import { useEffect, useContext } from "react";
import isEqual from "lodash/isEqual";

import ActiveContext from "./context/ActiveContext";
import GraphContext from "./context/GraphContext";
import SelectedContext from "./context/SelectedContext";
import AgencyLevelContext from "./context/AgencyLevelContext";
import { agencyHierarchy } from "./constants/agencyHierarchy";

import { mappedGroups as cols } from "./constants/groups";

const GraphGenerator = ({ data, inputYear }) => {
  const { agencyLevel, setAgencyLevel } = useContext(AgencyLevelContext);
  const { selected, setSelected } = useContext(SelectedContext);
  const { active, setActive } = useContext(ActiveContext);
  const { graph, setGraph } = useContext(GraphContext);

  const simpleFilterSelected = (links, nodes) => {
    let newLinks = links.map((l) => {
      const source = nodes[l.source];
      const target = nodes[l.target];
      //if (!target.fixedValue) target.fixedValue = 0;
      //target.fixedValue += l.value;
      if (
        (!selected[source.well] || source.selected) &&
        (!selected[target.well] || target.selected)
      ) {
        l.selected = true;
        target.selected = true;
      } else {
        l.selected = false;
      }
      return l;
    });
    links = links.filter((l) => l.source !== -1 && l.target !== -1);
    nodes.forEach((n, i) => (n.originalIndex = i));
    return [newLinks, nodes];
  };

  const maybeFilterSelected = (links, nodes, remove) => {
    let newLinks = links.map((l) => {
      const source = nodes[l.source];
      const target = nodes[l.target];
      //if (!target.fixedValue) target.fixedValue = 0;
      //target.fixedValue += l.value;
      if (
        (!selected[source.well] || source.selected) &&
        (!selected[target.well] || target.selected)
      ) {
        l.selected = true;
      } else {
        l.selected = false;
      }
      return l;
    });
    let newNodes = nodes.filter((n, i) => {
      const otherWell = n.well === 0 ? 1 : 0;
      const wellHasSelected =
        selected[n.well] ||
        (!active[n.well] && !selected[n.well] && selected[otherWell]);
      if (!wellHasSelected || n.selected) {
        n.originalIndex = i;
        return true;
      }
    });
    if (newNodes.length !== nodes.length) {
      newLinks.forEach((l) => {
        l.source = newNodes.findIndex((n) => n.originalIndex === l.source);
        l.target = newNodes.findIndex((n) => n.originalIndex === l.target);
      });
      newLinks = newLinks.filter((l) => l.source !== -1 && l.target !== -1);
    }
    return [newLinks, newNodes];
    //return [links,nodes];
  };

  const getNodeAgencyHierarchy = (node) => {
    let nodeHierarchy = [];
    const datum = data.find(
      (d) => d[agencyHierarchy[agencyLevel]].trim() === node.name
    );
    if (datum) {
      for (let level = 0; level < agencyLevel; level++) {
        nodeHierarchy[level] = datum[agencyHierarchy[level]].trim();
      }
    }
    return nodeHierarchy;
  };

  const getNodes = (type, index) => {
    let nodes = [];
    let col = type === "agency" ? agencyHierarchy[agencyLevel] : cols[type];
    if (type === "agency") {
      nodes = [
        ...new Set(
          data.map((d) => (d[col] && d[col].length ? d[col].trim() : null))
        ),
      ];
    } else {
      nodes = col;
    }
    const otherWell = index === 0 ? 1 : 0;
    const selectedVal =
      !active[index] && !selected[index]
        ? selected[otherWell]
        : selected[index];
    nodes = nodes
      .filter((n) => n !== null && n.value !== 0)
      .map((n) => {
        const name = n.trim();
        let node = {
          type: type,
          name: name,
          selected: selectedVal === name,
          well: index,
        };
        if (type === "agency") {
          node.agencyHierarchy = getNodeAgencyHierarchy(node);
          if (node.agencyHierarchy.indexOf(selectedVal) !== -1)
            node.selected = true;
        }
        return node;
      });
    return nodes;
  };

  const getDatumValidityForColumn = (datum, column) => {
    let valid = datum.fy === inputYear;

    if (valid) {
      const agency = datum[agencyHierarchy[agencyLevel]].trim();
      switch (column.type) {
        case "agency":
        case "administration":
          return {
            valid: column.name === agency,
            target: "mitigation",
          };
          break;
        default:
          return {
            valid: parseInt(datum[column.name]) != 0,
            target: column.name,
          };
          break;
      }
    }
    return {
      valid: valid,
      target: column.name,
    };
  };

  const getDatumValue = (datum, primary, secondary) => {
    let primaryValidity = getDatumValidityForColumn(datum, primary);
    let secondaryValidity = getDatumValidityForColumn(datum, secondary);
    if (primaryValidity.valid && secondaryValidity.valid) {
      //For the most part, rows are distributed based on the mitigation funds since other types of funding are not tracked in this module
      //However, a few rows have adaptation, etc. spending applied - thus the mitigation total may or may not be 100% of the assigned funding across other breakdowns
      //TODO: Update to correctly calculate adaptation and science funding
      let total = parseInt(datum.mitigation);
      let source_val, target_val, filter_val;
      source_val = parseInt(datum[primaryValidity.target].replace(",", ""));
      target_val = parseInt(datum[secondaryValidity.target].replace(",", ""));
      filter_val = total;
      const valid = total && source_val && target_val;
      if (valid) {
        return (source_val / total) * (filter_val / total) * target_val;
      }
    }
    return null;
  };

  const getLinks = (data, primary, secondary) => {
    let links = [];
    primary.forEach((p, pIndex) => {
      secondary.forEach((s, sIndex) => {
        sIndex += primary.length;
        let link = {
          source: pIndex,
          target: sIndex,
          value: 0,
          isProjected:false,
        };
        let linkProjected = {
          source: pIndex,
          target: sIndex,
          value: 0,
          isProjected:true,
        }
        data.forEach((datum, d) => {
          const value = getDatumValue(datum, p, s);
          if (value) {
            if (datum['tax_credit'] && +datum['tax_credit'] > 0) {
              linkProjected.value += value;
            } else {
              link.value += value;
            }
          }
        });
        if (linkProjected.value) links.push(linkProjected);
        if (link.value) links.push(link);
      });
    });
    return links;
  };

  const graphIsValid = (graph) =>
    graph.nodes && graph.nodes.length && graph.links && graph.links.length
      ? true
      : false;

  let localGraph = {
    nodes: [],
    links: [],
  };

  if (active[0]) {
    const primaryNodes = getNodes(active[0], 0);
    const secondaryNodes = getNodes(active[1] ? active[1] : active[0], 1);

    localGraph.nodes = primaryNodes.concat(secondaryNodes);
    localGraph.links = getLinks(data, primaryNodes, secondaryNodes);
  } else if (active[1]) {
    const primaryNodes = getNodes(active[1], 0);
    const secondaryNodes = getNodes(active[1], 1);

    localGraph.nodes = primaryNodes.concat(secondaryNodes);
    localGraph.links = getLinks(data, primaryNodes, secondaryNodes);
  }

  useEffect(() => {
    setGraph(localGraph);
  }, [data]);

  useEffect(() => {
    localGraph.trueTotal = localGraph.links.reduce((a, b) => a + b.value, 0);
    localGraph.agencyTotals = localGraph.links.reduce((a, b) => {
      const source = localGraph.nodes[b.source];
      const target = localGraph.nodes[b.target];
      const agencyNode =
        source.type == "agency"
          ? source
          : target.type == "agency"
          ? target
          : null;
      if (agencyNode && agencyNode.agencyHierarchy.length) {
        const agency = agencyNode.agencyHierarchy[0];
        a[agency] = (a[agency] ? a[agency] : 0) + b.value;
      }
      return a;
    }, {});
    localGraph.raw = Object.assign({}, localGraph);
    localGraph.raw.links = localGraph.raw.links.map((l) => {
      return { ...l };
    });
    localGraph.raw.nodes = localGraph.raw.nodes.map((n) => {
      return { ...n };
    });
    [localGraph.raw.links, localGraph.raw.nodes] = simpleFilterSelected(
      localGraph.raw.links,
      localGraph.raw.nodes
    );
    localGraph.raw.valid = graphIsValid(localGraph.raw);

    [localGraph.links, localGraph.nodes] = maybeFilterSelected(
      localGraph.links,
      localGraph.nodes
    );
    localGraph.total = localGraph.links.reduce((a, b) => a + b.value, 0);
    localGraph.valid = graphIsValid(localGraph);

    if (
      !graph ||
      !graph.nodes ||
      !isEqual(
        localGraph.nodes.map((n) => n.name),
        graph.nodes.map((n) => n.name)
      )
    ) {
      setGraph(localGraph);
    }
  });
};

export default GraphGenerator;
