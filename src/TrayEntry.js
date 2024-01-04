import React, { useContext } from "react";
import GraphContext from "./context/GraphContext";
import labels from "./constants/labels";

import utils from "./utils";
import { filterColors } from "./constants/filterColors";
import TrayEntryLegend from "./TrayEntryLegend";

const nodeIsNode = (node) => node.sourceLinks != undefined;

const TrayEntry = (props) => {
  const { graph, setGraph } = useContext(GraphContext);

  const node = props.node;
  const summaries = props.summaries;
  const isNode = nodeIsNode(node);
  const isLink = !isNode;

  const total = graph.total;
  const trueTotal = graph.trueTotal;

  const percentage = utils.toPercentage(node.value / total);
  const linkPercentage = isLink
    ? utils.toPercentage(node.value / node.target.value)
    : null;
  const linkReversePercentage = isLink
    ? utils.toPercentage(node.value / node.source.value)
    : null;
  const truePercentage = utils.toPercentage(node.value / trueTotal);
  const amount = utils.toMillions(node.value, 2);

  let agencyPercentage = 0;
  let agency = undefined;
  if (node.type === "agency" && node.agencyHierarchy.length) {
    const agencyName = node.agencyHierarchy[0];
    if (agencyName) {
      agency = labels.getLabel(agencyName);
      agencyPercentage = utils.toPercentage(
        node.value / graph.agencyTotals[agencyName]
      );
    }
  }

  if (props.truncated && summaries && (summaries.source || summaries.target)) {
    const activeSummaries =
      summaries.source && Object.keys(summaries.source).length
        ? summaries.source
        : summaries.target;
    if (Object.keys(activeSummaries).length > 4) {
      let s = 0;
      let other = 0;
      for (let key in activeSummaries) {
        if (s > 2) {
          other += activeSummaries[key];
          delete activeSummaries[key];
        }
        s++;
      }
      activeSummaries["Other"] = other;
    }
  }
  return (
    <div className="tray__entry">
      {isNode != false && (
        <div className="tray__entry__content">
          <div className="tray__entry__header">
            <h3
              style={{
                color:
                  node.type === "agency" ||
                  node.type === "solution" ||
                  node.type === "sector"
                    ? "#fff"
                    : "#000",
                borderLeft: `5px solid ${filterColors[node.type]}`
              }}
            >
              {node.type === "agency" ? (
                <React.Fragment>
                  <span
                    className="highlight"
                    style={{
                      backgroundColor: `${filterColors[node.type]}`,
                    }}
                  >
                    {` ${node.agencyHierarchy.map((a) => `${a} > `)}`}
                    {` ${labels.getLabel(node.name)}`}
                  </span>
                </React.Fragment>
              ) : (
                <span
                  className="highlight"
                  style={{
                    backgroundColor: `${filterColors[node.type]}`,
                  }}
                >
                  <React.Fragment>{labels.getLabel(node.name)}</React.Fragment>
                </span>
              )}
            </h3>
            <strong>
              {node.type === "agency" && (
                <React.Fragment>{amount}</React.Fragment>
              )}
            </strong>
            <strong>
              <React.Fragment>
                {total === trueTotal ? (
                  <React.Fragment>
                    <br />
                    {percentage} of FY{props.shortYear} climate innovation
                    funding
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <br />
                    {percentage} of selected climate innovation funding
                    <small>
                      {truePercentage} of all FY{props.shortYear} climate
                      innovation funding
                    </small>
                    {agency && (
                      <small>
                        {agencyPercentage} of all {agency} FY{props.shortYear}{" "}
                        climate innovation funding
                      </small>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            </strong>
          </div>
          {node.targetLinks.length != 0 &&
            summaries.source &&
            Object.entries(summaries.source).length != 0 && (
              <React.Fragment>
                <h4>
                  {total === trueTotal
                    ? "Came from:"
                    : "Selected funding came from:"}
                </h4>
                <ul className="breakdown breakdown-source">
                  {Object.entries(summaries.source).map(([key, value]) => {
                    return (
                      value !== 0 && (
                        <li className="tooltip-link" key={key}>
                          <span className="value">
                            {utils.toPercentage(value)}
                          </span>
                          <label>{labels.getLabel(key)}</label>
                        </li>
                      )
                    );
                  })}
                </ul>
              </React.Fragment>
            )}
          {node.targetLinks.length == 0 &&
            summaries.target &&
            Object.entries(summaries.target).length != 0 && (
              <React.Fragment>
                <h4>
                  {total === trueTotal
                    ? "Went to:"
                    : "Selected funding went to:"}
                </h4>
                <ul className="breakdown breakdown-target">
                  {Object.entries(summaries.target).map(([key, value]) => {
                    return (
                      value !== 0 && (
                        <li className="tooltip-link" key={key}>
                          <span className="value">
                            {utils.toPercentage(value)}
                          </span>
                          <label>{labels.getLabel(key)}</label>
                        </li>
                      )
                    );
                  })}
                </ul>
              </React.Fragment>
            )}
        </div>
      )}
      {isLink != false && (
        <div className="tray__entry__content">
          <div className="tray__entry__header">
            <p>
              In FY 20{props.shortYear}, {linkPercentage} of{" "}
              {percentage === truePercentage ? "" : "selected "}
              <strong>{labels.getLabel(node.target.name)}</strong> climate
              innovation funding came from{" "}
              <strong>{labels.getLabel(node.source.name)}</strong>.
            </p>
            <p>
              {linkReversePercentage} of{" "}
              {percentage === truePercentage ? "" : "selected "}
              <strong>{labels.getLabel(node.source.name)}</strong> climate
              innovation funding went to{" "}
              <strong>{labels.getLabel(node.target.name)}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrayEntry;
