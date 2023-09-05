import React, { useState, useEffect, useContext } from "react";
import Switch  from 'react-input-switch'

import GraphContext from './context/GraphContext'
import HighlightedContext from './context/HighlightedContext'
import ActiveContext from './context/ActiveContext'
import ReadyContext from './context/ReadyContext'
import SelectedContext from './context/SelectedContext'
import AgencyLevelContext from './context/AgencyLevelContext'
import HelpersContext from './context/HelpersContext'

import { FaInfo } from 'react-icons/fa'

const Sticky = props => {
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
  }

  let pos = props.position();
  if (!pos) pos = {x:0,y:0}

  const shouldShow = props.showWhen();
  if (shouldShow && !showThisTip && !userClosed) {
    setShowThisTip(true);
  } else if (!shouldShow && showThisTip) {
    setShowThisTip(false);
  }

  return (
    <div className={`sticky${props.type === 'info' ? ' sticky-info' : ''}${showThisTip && props.showTips ? ' active' : ''}`}
      style={{top:pos.y,left:pos.x}}>
      <div className="sticky__close" onClick={handleClose}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="m12.45 37.65-2.1-2.1L21.9 24 10.35 12.45l2.1-2.1L24 21.9l11.55-11.55 2.1 2.1L26.1 24l11.55 11.55-2.1 2.1L24 26.1Z"/></svg></div>
      <div className="sticky__content">
        {props.type == 'info' && <div className="info"><FaInfo /></div>}
        <div className="sticky__content__inner">{props.content}</div>
      </div>
    </div>
  )
}

const Stickies = props => {
  const {selected,setSelected} = useContext(SelectedContext);
  const {highlighted,setHighlighted} = useContext(HighlightedContext);
  const {active,setActive} = useContext(ActiveContext);
  const {agencyLevel,setAgencyLevel} = useContext(AgencyLevelContext);
  const {showHelpers,setShowHelpers} = useContext(HelpersContext);

  const [showTips, setShowTips] = useState(1);

  const container = document.querySelector('.App');

  if (container) {
    const cont_box = container.getBoundingClientRect();
    const height = cont_box.height;
    const width = window.innerWidth;

    const pxToPercentage = (pos) => {
      return {
        x:pos.x/width * 100 + "%",
        y:(pos.y-8)/height * 100 + "%"
      }
    }

    const stickies = [{
      type:'info',
      content:'In FY21, DOE contributed twice as much funding for climate innovation as the other two agencies ($7.36B).',
      position:() => {
        const ref = document.querySelector('.wells__well-0');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + 40
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && !selected[0] && !active[1] && !showHelpers;
      }
    },{
      type:'help',
      content:'To learn more about each category, visit the Definitions & Methodology page',
      position:() => {
        const ref = document.querySelector('.app-footer .component-filters');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + 20,
            y: box.y - 90
          });
        }
      },
      showWhen:() => {
        return showHelpers && active[0] == null
      }
    },{
      type:'help',
      content:'This sidebar summarizes the specifics based on your selection',
      position:() => {
        const ref = document.querySelector('.app-main');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width*.7,
            y: box.y + box.height/2
          });
        }
      },
      showWhen:() => {
        return showHelpers && active[0] != null && active[1] == null
      }
    },{
      type:'help',
      content:'You can toggle these tips off and bring them back any time.',
      position:() => {
        const ref = document.querySelector('.app-main');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width*.7,
            y: box.y + box.height - 40
          });
        }
      },
      showWhen:() => {
        return showHelpers && active[0] != null && active[1] == null
      }
    },{
      type:'help',
      content:'You can download the data as a spreadsheet or a visualization',
      position:() => {
        const ref = document.querySelector('.download-trigger ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x - 40,
            y: box.y - 90
          });
        }
      },
      showWhen:() => {
        return showHelpers && active[0] != null && active[1] != null
      }
    },{
      type:'help',
      content:'Use the outer segments to navigate back to parent offices and agencies.',
      position:() => {
        const ref = document.querySelector('.wells__well-0 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + 10,
            y: box.y + .2*box.height
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && selected[0] && !showHelpers;
      }
    },{
      type:'help',
      content:'Use the outer segments to navigate back to parent offices and agencies.',
      position:() => {
        const ref = document.querySelector('.wells__well-1 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + .2*box.height
          });
        }
      },
      showWhen:() => {
        return active[1] === 'agency' && selected[1] && !showHelpers;
      }
    },{
      type:'help',
      content:'Click to select chart segments for a detailed view, then click again to deselect and view all funding.',
      position:() => {
        const ref = document.querySelector('.wells__well-0 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x - 20,
            y: box.y + .2*box.height
          });
        }
      },
      showWhen:() => {
        return active[0] != null && active[0] !== 'agency' && !selected[0] && !showHelpers;
      }
    },{
      type:'help',
      content:'Click on chart segments for a detailed view of funding within departments and programs of each agency.',
      position:() => {
        const ref = document.querySelector('.wells__well-0 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + box.height/2
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && !selected[0] && !showHelpers;
      }
    },{
      type:'info',
      content:'DOE funds the greatest diversity of sectors in climate innovation, compared to DOT (which dedicates nearly 100% of its climate innovation funding to transportation) and USDA (divided nearly half-half between Agriculture and Forestry)',
      position:() => {
        const ref = document.querySelector('.wells__well-0 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 100,
            y: box.y - 90
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && !selected[0] && !showHelpers && active[1] === 'sector';
      }
    },{
      type:'info',
      content:'If you cross-reference Agencies with Sectors, you can see that Power and Transportation receive the main bulk of climate innovation funding.',
      position:() => {
        const ref = document.querySelector('.wells__well-1 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x - 200,
            y: box.y - 50
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && !selected[0] && !showHelpers && active[1] === 'sector';
      }
    },{
      type:'info',
      content:'The smallest share of climate innovation funding goes toward Industry and Buildings',
      position:() => {
        const ref = document.querySelector('.wells__well-1');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + box.height - .3 * box.height
          });
        }
      },
      showWhen:() => {
        return !showHelpers && (active[1] === 'sector' && !selected[1]);
      }
    },{
      type:'info',
      content:'The smallest share of climate innovation funding goes toward Industry and Buildings',
      position:() => {
        const ref = document.querySelector('.wells__well-0');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + box.height - .3 * box.height
          });
        }
      },
      showWhen:() => {
        return !showHelpers && (active[0] === 'sector' && !selected[0]);
      }
    },{
      type:'info',
      content:'Approximately 70% of transportation funding is from the DOT; 30% from DOE',
      position:() => {
        const ref = document.querySelector('.wells__well-1');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + box.height/2 - 100
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && !selected[0] && !showHelpers && active[1] === 'sector' && !selected[1];
      }
    },{
      type:'info',
      content:'The main DOE offices with piloting and demo programs are EERE, Nuclear, Fossil Energy and Carbon Management, and ARPA-E',
      position:() => {
        const ref = document.querySelector('.wells__well-1 ');
        if (ref) {
          const box = ref.getBoundingClientRect();
          return pxToPercentage({
            x: box.x + box.width - 10,
            y: box.y + box.height*.8 - 100
          });
        }
      },
      showWhen:() => {
        return active[0] === 'agency' && selected[0] == "DOE" && !showHelpers && active[1] === 'stage';
      }
    }]

    return (
      <div className="component-stickies">
        <div className="stickies__control">
          <div className="stickies__label">Insight Tips</div>
          <Switch 
            onChange={setShowTips} 
            value={showTips}
            className={"stickies__toggle"} />
        </div>
        <div className="stickies__stickies">
          {stickies.map((sticky,s) => <Sticky key={s} type={sticky.type} content={sticky.content} showTips={showTips} position={sticky.position} showWhen={sticky.showWhen} />)}
        </div>
      </div>
    )
  }
  return undefined;
}

export default Stickies;