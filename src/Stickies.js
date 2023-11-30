import React, { useState, useEffect, useContext } from "react";
import Switch from "react-input-switch";

import HighlightedContext from "./context/HighlightedContext";
import ActiveContext from "./context/ActiveContext";
import SelectedContext from "./context/SelectedContext";
import AgencyLevelContext from "./context/AgencyLevelContext";
import HelpersContext from "./context/HelpersContext";

import { FaInfo } from "react-icons/fa";

const Sticky = (props) => {
  const [showThisTip, setShowThisTip] = useState(true);
  const [userClosed, setUserClosed] = useState(false);
  const [tipsTurnedOff, setTipsTurnedOff] = useState(false);

  if (!props.showTips && !tipsTurnedOff) {
    setTipsTurnedOff(true);
  } else if (props.showTips && tipsTurnedOff) {
    setTipsTurnedOff(false);
    if (showThisTip === false) setShowThisTip(true);
  }

  const handleClose = () => {
    setShowThisTip(!showThisTip);
    setUserClosed(true);
  };

  let pos = props.position();
  if (!pos) pos = { x: 0, y: 0 };

  const shouldShow = props.showWhen();
  if (shouldShow && !showThisTip && !userClosed) {
    setShowThisTip(true);
  } else if (!shouldShow && showThisTip) {
    setShowThisTip(false);
  }

  return (
    <div
      className={`sticky${props.type === "info" ? " sticky-info" : ""}${
        showThisTip && props.showTips ? " active" : ""
      }`}
      style={{ top: pos.y, left: pos.x }}
    >
      <div className="sticky__close" onClick={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z" />
        </svg>
      </div>
      <div className="sticky__content">
        {props.type == "info" && (
          <div className="info">
            <FaInfo />
          </div>
        )}
        <div className="sticky__content__inner">{props.content}</div>
      </div>
    </div>
  );
};

const Stickies = (props) => {
  const { selected, setSelected } = useContext(SelectedContext);
  const { highlighted, setHighlighted } = useContext(HighlightedContext);
  const { active, setActive } = useContext(ActiveContext);
  const { agencyLevel, setAgencyLevel } = useContext(AgencyLevelContext);
  const { showHelpers, setShowHelpers } = useContext(HelpersContext);

  const [showTips, setShowTips] = useState(1);

  const container = document.querySelector(".App");

  if (container) {
    const cont_box = container.getBoundingClientRect();
    const height = cont_box.height;
    const width = window.innerWidth;

    const pxToPercentage = (pos) => {
      return {
        x: (pos.x / width) * 100 + "%",
        y: ((pos.y - 8) / height) * 100 + "%",
      };
    };

    const stickies = [
      // {
      //   type: "info",
      //   content: `In FY${props.shortYear}, DOE contributed twice as much funding for climate innovation as the other two agencies ($7.36B).`,
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-0");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 10,
      //         y: box.y + 40,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return (
      //       active[0] === "agency" && !selected[0] && !active[1] && !showHelpers
      //     );
      //   },
      // },
      {
        type: "help",
        content:
          "To learn more about each category, visit the Definitions & Methodology page",
        position: () => {
          const ref = document.querySelector(".app-footer .component-filters");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + 20,
              y: box.y - 90,
            });
          }
        },
        showWhen: () => {
          return showHelpers && active[0] == null;
        },
      },
      {
        type: "help",
        content:
          "This sidebar summarizes the specifics based on your selection",
        position: () => {
          const ref = document.querySelector(".app-main");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width * 0.7,
              y: box.y + box.height / 2,
            });
          }
        },
        showWhen: () => {
          return showHelpers && active[0] != null && active[1] == null;
        },
      },
      {
        type: "help",
        content: "You can toggle these tips off and bring them back any time.",
        position: () => {
          const ref = document.querySelector(".app-main");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width * 0.7,
              y: box.y + box.height - 40,
            });
          }
        },
        showWhen: () => {
          return showHelpers && active[0] != null && active[1] == null;
        },
      },
      {
        type: "help",
        content:
          "You can download the data as a spreadsheet or a visualization",
        position: () => {
          const ref = document.querySelector(".download-trigger ");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x - 40,
              y: box.y - 90,
            });
          }
        },
        showWhen: () => {
          return showHelpers && active[0] != null && active[1] != null;
        },
      },
      {
        type: "help",
        content:
          "Use the outer segments to navigate back to parent offices and agencies.",
        position: () => {
          const ref = document.querySelector(".wells__well-0 ");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + 10,
              y: box.y + 0.2 * box.height,
            });
          }
        },
        showWhen: () => {
          return active[0] === "agency" && selected[0] && !showHelpers;
        },
      },
      {
        type: "help",
        content:
          "Use the outer segments to navigate back to parent offices and agencies.",
        position: () => {
          const ref = document.querySelector(".wells__well-1 ");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width - 10,
              y: box.y + 0.2 * box.height,
            });
          }
        },
        showWhen: () => {
          return active[1] === "agency" && selected[1] && !showHelpers;
        },
      },
      {
        type: "help",
        content:
          "Click to select chart segments for a detailed view, then click again to deselect and view all funding.",
        position: () => {
          const ref = document.querySelector(".wells__well-0 ");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x - 30,
              y: box.y - 110,
            });
          }
        },
        showWhen: () => {
          return (
            active[0] != null &&
            active[0] !== "agency" &&
            !selected[0] &&
            !showHelpers
          );
        },
      },
      {
        type: "help",
        content:
          "Click on chart segments for a detailed view of funding within departments and programs of each agency.",
        position: () => {
          const ref = document.querySelector(".wells__well-0 ");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x - 30,
              y: box.y - 110,
            });
          }
        },
        showWhen: () => active[0] === "agency" && !selected[0] && !showHelpers,
      },
      {
        type: "info",
        content: "Due to the sizable Greenhouse Gas Reduction Fund, EPA received 38.8% of total funding in FY23, surpassing DOE, the leader in previous years.",
        position: () => {
          const well0 = active[0] === 'agency';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: well0 ? box.x + box.width - 10 : box.x - 250,
              y: box.y + (box.height * .5) + 20,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'agency' && !selected[0]) || (active[1] === 'agency' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The power sector received the most investment of any sector, making it the only sector to come close to matching its funding with its relative contribution to GHG emissions. ",
        position: () => {
          const well0 = active[0] === 'sector';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: well0 ? box.x + box.width - 10 : box.x - 250,
              y: box.y + box.height * .2 - 80,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'sector' && !selected[0]) || (active[1] === 'sector' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The smallest shares of funding went toward buildings (15.4%), industry (7.1%), agriculture (3.4%), and forestry (2.8%)",
        position: () => {
          const well0 = active[0] === 'sector';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: well0 ? box.x + box.width - 10 : box.x - 250,
              y: box.y + box.height - 150,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'sector' && !selected[0]) || (active[1] === 'sector' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "Clean electricity and electrification received half of total funding in FY23",
        position: () => {
          const well0 = active[0] === 'solution';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: well0 ? box.x + box.width - 10 : box.x - 250,
              y: box.y + box.height * .5 - 45,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'solution' && !selected[0]) || (active[1] === 'solution' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The IIJA and IRA shifted focus to deployment, which received nearly three-quarters of total climate innovation investments in FY23",
        position: () => {
          const well0 = active[0] === 'stage';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x - 30,
              y: box.y + box.height * .5 - 90,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'stage' && !selected[0]) || (active[1] === 'stage' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "Nearly two-thirds of total funding was delivered as one-time appropriations in FY23",
        position: () => {
          const well0 = active[0] === 'funding_type';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x - 30,
              y: box.y + box.height * .2,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'funding_type' && !selected[0]) || (active[1] === 'funding_type' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The vast majority of total funding was delivered by the IIJA and IRA, rather than annual appropriations in FY23.",
        position: () => {
          const well0 = active[0] === 'funding_source';
          const ref = document.querySelector(well0 ? ".wells__well-0" : ".wells__well-1");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: well0 ? box.x - 30 : box.x - 250,
              y: box.y + box.height * .27,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            ((active[0] === 'funding_source' && !selected[0]) || (active[1] === 'funding_source' && !selected[1])) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "Most agencies fund a diversity of sectors. The exception is DOT, which dedicates nearly all of its climate innovation funding to transportation.",
        position: () => {
          const ref = document.querySelector(".app-main .component-sankey");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width / 2 - 130,
              y: box.y - 120,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            (
              (active[0] === 'agency' && !selected[0] && active[1] === 'sector' && !selected[1]) || 
              (active[1] === 'agency' && !selected[1] && active[0] === 'sector' && !selected[0])
            ) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "Every agency funds a variety of solutions.",
        position: () => {
          const ref = document.querySelector(".app-main .component-sankey");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width / 2 - 130,
              y: box.y - 70,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            (
              (active[0] === 'agency' && !selected[0] && active[1] === 'solution' && !selected[1]) || 
              (active[1] === 'agency' && !selected[1] && active[0] === 'solution' && !selected[0])
            ) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The IIJA and IRA drove increases in funding for solutions that are ready to be deployed today, such as efficiency, clean electricity, and electrification. ",
        position: () => {
          const ref = document.querySelector(".app-main .component-sankey");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width / 2 - 130,
              y: box.y + box.height - 120,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            (
              (active[0] === 'funding_source' && !selected[0] && active[1] === 'solution' && !selected[1]) || 
              (active[1] === 'funding_source' && !selected[1] && active[0] === 'solution' && !selected[0])
            ) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "The vast majority of funding for pilots and demonstrations goes to a single agency—DOE.",
        position: () => {
          const ref = document.querySelector(".app-main .component-sankey");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width / 2 - 130,
              y: box.y - 10,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            (
              (active[0] === 'agency' && !selected[0] && active[1] === 'stage' && !selected[1]) || 
              (active[1] === 'agency' && !selected[1] && active[0] === 'stage' && !selected[0])
            ) &&
            !showHelpers
          );
        },
      },
      {
        type: "info",
        content: "FY23 appropriations for EPA and DOI are not yet included here, only funding from IIJA and IRA. Coming soon! ",
        position: () => {
          const ref = document.querySelector(".app-main .component-sankey");
          if (ref) {
            const box = ref.getBoundingClientRect();
            return pxToPercentage({
              x: box.x + box.width / 2 - 130,
              y: box.y - 10,
            });
          }
        },
        showWhen: () => {
          return (
            parseInt(props.shortYear) === 23 &&
            (
              (active[0] === 'agency' && !selected[0] && active[1] === 'funding_source' && !selected[1]) || 
              (active[1] === 'agency' && !selected[1] && active[0] === 'funding_source' && !selected[0])
            ) &&
            !showHelpers
          );
        },
      },
      // {
      //   type: "info",
      //   content:
      //     "DOE funds the greatest diversity of sectors in climate innovation, compared to DOT (which dedicates nearly 100% of its climate innovation funding to transportation) and USDA (divided nearly half-half between Agriculture and Forestry)",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-0 ");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 100,
      //         y: box.y - 90,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return (
      //       active[0] === "agency" &&
      //       !selected[0] &&
      //       !showHelpers &&
      //       active[1] === "sector"
      //     );
      //   },
      // },
      // {
      //   type: "info",
      //   content:
      //     "If you cross-reference Agencies with Sectors, you can see that Power and Transportation receive the main bulk of climate innovation funding.",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-1 ");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x - 200,
      //         y: box.y - 50,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return (
      //       active[0] === "agency" &&
      //       !selected[0] &&
      //       !showHelpers &&
      //       active[1] === "sector"
      //     );
      //   },
      // },
      // {
      //   type: "info",
      //   content:
      //     "The smallest share of climate innovation funding goes toward Industry and Buildings",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-1");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 10,
      //         y: box.y + box.height - 0.3 * box.height,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return !showHelpers && active[1] === "sector" && !selected[1];
      //   },
      // },
      // {
      //   type: "info",
      //   content:
      //     "The smallest share of climate innovation funding goes toward Industry and Buildings",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-0");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 10,
      //         y: box.y + box.height - 0.3 * box.height,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return !showHelpers && active[0] === "sector" && !selected[0];
      //   },
      // },
      // {
      //   type: "info",
      //   content:
      //     "Approximately 70% of transportation funding is from the DOT; 30% from DOE",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-1");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 10,
      //         y: box.y + box.height / 2 - 100,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return (
      //       active[0] === "agency" &&
      //       !selected[0] &&
      //       !showHelpers &&
      //       active[1] === "sector" &&
      //       !selected[1]
      //     );
      //   },
      // },
      // {
      //   type: "info",
      //   content:
      //     "The main DOE offices with piloting and demo programs are EERE, Nuclear, Fossil Energy and Carbon Management, and ARPA-E",
      //   position: () => {
      //     const ref = document.querySelector(".wells__well-1 ");
      //     if (ref) {
      //       const box = ref.getBoundingClientRect();
      //       return pxToPercentage({
      //         x: box.x + box.width - 10,
      //         y: box.y + box.height * 0.8 - 100,
      //       });
      //     }
      //   },
      //   showWhen: () => {
      //     return (
      //       active[0] === "agency" &&
      //       selected[0] == "DOE" &&
      //       !showHelpers &&
      //       active[1] === "stage"
      //     );
      //   },
      // },
    ];

    return (
      <div className="component-stickies">
        <div className="stickies__control">
          <div className="stickies__label">Tips:</div>
          <Switch
            onChange={setShowTips}
            value={showTips}
            className={"stickies__toggle"}
          />
        </div>
        <div className="stickies__stickies">
          {stickies.map((sticky, s) => (
            <Sticky
              key={s}
              type={sticky.type}
              content={sticky.content}
              showTips={showTips}
              position={sticky.position}
              showWhen={sticky.showWhen}
            />
          ))}
        </div>
      </div>
    );
  }
  return undefined;
};

export default Stickies;
