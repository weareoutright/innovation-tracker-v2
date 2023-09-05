import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom";

import * as Papa from 'papaparse';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaChevronCircleRight,FaChevronCircleLeft, FaTimes } from 'react-icons/fa'

import Header from "./Header";
import Footer from "./Footer";
import GraphGenerator from "./GraphGenerator";
import Tray from "./Tray";
import AppCore from "./AppCore"
import ParamsController from "./ParamsController"

import { ReadyProvider } from './context/ReadyContext'
import { ActiveProvider } from './context/ActiveContext'
import { GraphProvider } from './context/GraphContext'
import { HighlightedProvider } from './context/HighlightedContext'
import { SelectedProvider } from './context/SelectedContext'
import { AgencyLevelProvider } from './context/AgencyLevelContext'
import { HelpersProvider } from './context/HelpersContext'
import { TrayProvider } from './context/TrayContext'

import sources from "./constants/sources";

import "./theme/styles.scss";

function App() {

  const [data, setData] = useState(null);
  const [graph, setGraph] = useState({});
  const [active, setActive] = useState([null,null]);
  const [ready, setReady] = useState([true,true]);
  const [highlighted, setHighlighted] = useState({links:[],nodes:[]})
  const [selected, setSelected] = useState([null,null]);
  const [agencyLevel, setAgencyLevel] = useState(0);
  const [showHelpers, setShowHelpers] = useState(true);
  const [showTray, setShowTray] = useState(false);

  useEffect(() => {
    fetch(sources.data)
      .then(res => res.text()
        .then(txt => {
          Papa.parse(txt, {
            header: true,
            skipEmptyLines: true,
            complete: (parsed) => {
              setData(parsed.data);
            },
          })
        })
      )
  }, []);

  const activeIndex = active.findIndex(a => a !== null);
  const totalActive = active.findLastIndex(a => a !== null) + 1;
  const totalReady = ready.findLastIndex(r => r !== false) + 1;
  const activeNodes = graph && graph.nodes ? (totalActive === 1 ? graph.nodes.length / 2 : graph.nodes.length) : 0;

  return (
    <HelpersProvider value={{showHelpers, setShowHelpers}}>
      <ActiveProvider value={{active, setActive}}>
        <GraphProvider value={{graph, setGraph}}>
          <SelectedProvider value={{selected, setSelected}}>
            <AgencyLevelProvider value={{agencyLevel, setAgencyLevel}}>
              {data !== null && <GraphGenerator data={data} />}
              <ReadyProvider value={{ready, setReady}}>
                <div className={`App${activeIndex !== -1 ? ' first_active-'+activeIndex : ''}${totalActive !== 0 ? ' has_active-'+totalActive : ''} has_ready-${totalReady} ${showHelpers ? 'tutorial-active' : ''} ${showTray ? 'show-tray' : ''}`}>
                  <div className="app__inner">
                    {window.innerWidth >= 841 && (
                      <React.Fragment>
                        <Header />
                        <DndProvider backend={HTML5Backend}>
                          <div className="app-wrapper">
                            <HighlightedProvider value={{highlighted,setHighlighted}}>
                              <main className="app-main">
                                <AppCore />
                              </main>
                              <TrayProvider value={{showTray,setShowTray}}>
                                <Tray data={data} />
                              </TrayProvider>
                            </HighlightedProvider>
                          </div>
                          <Footer />
                          <Router>
                           <ParamsController />
                          </Router>
                        </DndProvider>
                      </React.Fragment>
                    )}
                    {window.innerWidth < 841 && (
                      <React.Fragment>
                        <div class="app__top">
                          <Header />
                          <DndProvider backend={TouchBackend} opts={{enableMouseEvents:true}}>
                            <div className="app-wrapper">
                              <HighlightedProvider value={{highlighted,setHighlighted}}>
                                <main className="app-main">
                                  <AppCore />
                                </main>
                              </HighlightedProvider>
                            </div>
                          </DndProvider>
                        </div>
                        <div class="app__bottom">
                          <DndProvider backend={TouchBackend} opts={{enableMouseEvents:true}}>
                            <TrayProvider value={{showTray,setShowTray}}>
                              <Tray data={data} />
                            </TrayProvider>
                            <Footer />
                            <Router>
                             <ParamsController />
                            </Router>
                          </DndProvider>
                        </div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </ReadyProvider>
            </AgencyLevelProvider>
          </SelectedProvider>
        </GraphProvider>
      </ActiveProvider>
    </HelpersProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
