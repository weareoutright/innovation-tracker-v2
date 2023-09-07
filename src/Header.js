import React, { useContext } from "react";
import ActiveContext from "./context/ActiveContext";
import GraphContext from "./context/GraphContext";
import SelectedContext from "./context/SelectedContext";
import AgencyLevelContext from "./context/AgencyLevelContext";
import HelpersContext from "./context/HelpersContext";

import utils from "./utils";
import labels from "./constants/labels";

const Header = ({ shortYear }) => {
  const { graph, setGraph } = useContext(GraphContext);
  const { active, setActive } = useContext(ActiveContext);
  const { selected, setSelected } = useContext(SelectedContext);
  const { agencyLevel, setAgencyLevel } = useContext(AgencyLevelContext);
  const { showHelpers, setShowHelpers } = useContext(HelpersContext);

  const percentage = utils.toPercentage(graph.total / graph.trueTotal, 0);
  const amount = utils.toMillions(graph.total);

  const anySelected = selected.find((s) => s !== null) != undefined;
  const anyActive = active.find((a) => a !== null) != undefined;

  const closeHeader = (index) => {
    const wasActive = active[index];
    active[index] = null;
    setActive([...active]);
    if (wasActive === "agency") setAgencyLevel(0);
    selected[index] = null;
    setSelected([...selected]);
    setShowHelpers(false);
  };

  return (
    <header className="app-header">
      <div className="component-well-headers">
        <div className="well__headers">
          {active.map((well, w) => {
            return (
              <React.Fragment key={w}>
                <div
                  className={`well__header${
                    well !== null ? " well__header-active" : ""
                  }`}
                  key={w}
                  onClick={() => closeHeader(w)}
                >
                  {well !== null && (
                    <h3>
                      <span onClick={() => closeHeader(w)}>
                        {labels.getLabel(well)}{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 48 48"
                        >
                          <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
                        </svg>
                      </span>
                      <em>
                        {selected[w]
                          ? utils.getTruncatedWords(
                              labels.getLabel(selected[w])
                            )
                          : "All"}
                      </em>
                    </h3>
                  )}
                </div>
                <React.Fragment>
                  {w == 0 && anyActive && (
                    <div className="well__header well__header-active well__header-main">
                      <h2>
                        {anySelected
                          ? `Selected FY${shortYear} Climate Innovation Funding`
                          : `FY${shortYear} Climate Innovation Funding`}
                        <em>
                          {amount} ({percentage})
                        </em>
                      </h2>
                    </div>
                  )}
                </React.Fragment>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
